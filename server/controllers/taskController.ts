import { Request, Response } from 'express';
import { Task, Label, TaskLabel } from '../models';

const createFilters = (req: Request) => {
  const status = req.query.status ? { statusId: Number(req.query.status) } : {};
  const executor = req.query.executor ? { executorId: Number(req.query.executor) } : {};
  const label = req.query.label ? { labelId: Number(req.query.label) } : {};
  const creator = req.query.isCreator === 'true' ? { creatorId: req.user?.id } : {};

  return {
    ...status,
    ...executor,
    ...label,
    ...creator,
  };
};

export default () => ({
  getList: async (req: Request, res: Response) => {
    const filters = createFilters(req);

    const tasks = await Task.query()
      .where(filters)
      .withGraphJoined('status')
      .withGraphJoined('creator')
      .withGraphJoined('executor')
      .withGraphJoined('labels')
      .orderBy('createdAt', 'desc');

    res.status(200).json(tasks);
  },
  getItem: async (req: Request, res: Response) => {
    const task = await Task.query()
      .findById(req.params.id)
      .withGraphJoined('status')
      .withGraphJoined('creator')
      .withGraphJoined('executor')
      .withGraphJoined('labels');

    if (!task) {
      res.status(404).json({
        error: 'TaskNotFound',
        message: 'Task not found',
      });

      return;
    }

    res.status(200).json(task);
  },
  create: async (req: Request, res: Response) => {
    const { name, description, statusId, executorId, labelIds = [] } = req.body;
    const creatorId = req.user?.id;
    const labels = await Label.query().whereIn('id', labelIds);

    const data = {
      name,
      description,
      statusId,
      executorId,
      creatorId,
      labels,
    };

    const transaction = await Task.startTransaction();

    try {
      const validData = Task.fromJson(data);
      const task = await Task.query(transaction).insert(validData);

      await Promise.all(
        labels.map((label) => TaskLabel.query(transaction)
          .insert({ taskId: task.id, labelId: label.id })),
      );

      await transaction.commit();

      res.status(201).json(task);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  update: async (req: Request, res: Response) => {
    const task = await Task.query().findById(req.params.id);

    if (!task) {
      res.status(404).json({
        error: 'TaskNotFound',
        message: 'Task not found',
      });

      return;
    }

    const { name, description, statusId, executorId, labelIds = [] } = req.body;
    const { creatorId } = task;
    const labels = await Label.query().whereIn('id', labelIds);

    const data = {
      name,
      description,
      statusId,
      executorId,
      creatorId,
      labels,
    };

    const transaction = await Task.startTransaction();

    try {
      const validData = Task.fromJson(data);

      await TaskLabel.query(transaction).delete().where('taskId', task.id);

      await task.$query(transaction).patch(validData);

      await Promise.all(
        labels.map((label) => TaskLabel.query(transaction)
          .insert({ taskId: task.id, labelId: label.id })),
      );

      await transaction.commit();

      res.status(200).json(task);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  delete: async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const task = await Task.query().findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });

      return;
    }

    if (task.creatorId !== req.user?.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });

      return;
    }

    try {
      await Task.query().deleteById(taskId);

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });

      throw error;
    }
  },
});
