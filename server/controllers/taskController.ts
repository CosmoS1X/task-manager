import { Request, Response } from 'express';
import { Task, Label, TaskLabel } from '../models';

export default () => ({
  getList: async (req: Request, res: Response) => {
    const filters = Object.entries(req.query).reduce((acc, [key, value]) => {
      if (!value) return acc;

      if (key === 'isCreator') {
        return value === 'true' ? { ...acc, creatorId: req.user?.id } : acc;
      }

      return { ...acc, [`${key}Id`]: Number(value) };
    }, {});

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
      res.status(404).json({ message: 'Task not found' });

      return;
    }

    res.status(200).json(task);
  },
  create: async (req: Request, res: Response) => {
    const { name, description, statusId, executorId, labelIds } = req.body;
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

      res.status(500).json({ message: 'Internal server error' });

      throw error;
    }
  },
  update: async (req: Request, res: Response) => {
    const task = await Task.query().findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });

      return;
    }

    const { name, description, statusId, executorId, labelIds } = req.body;
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

      res.status(500).json({ message: 'Internal server error' });

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
      res.status(403).json({ message: 'Access denied' });

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
