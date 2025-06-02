import { Request, Response } from 'express';
import { Label } from '../models';

export default () => ({
  getList: async (req: Request, res: Response) => {
    const labels = await Label.query();

    res.status(200).json(labels);
  },
  getItem: async (req: Request, res: Response) => {
    const label = await Label.query().findById(req.params.id);

    if (!label) {
      res.status(404).json({
        error: 'LabelNotFound',
        message: 'Label not found',
      });

      return;
    }

    res.status(200).json(label);
  },
  create: async (req: Request, res: Response) => {
    const validData = Label.fromJson(req.body);
    const existingLabel = await Label.query().findOne({ name: validData.name });

    if (existingLabel) {
      res.status(409).json({
        error: 'LabelAlreadyExists',
        message: 'Label with this name already exists',
      });

      return;
    }

    const newLabel = await Label.query().insert(validData);

    res.status(201).json(newLabel);
  },
  update: async (req: Request, res: Response) => {
    const validData = Label.fromJson(req.body);
    const existingLabel = await Label.query().findOne({ name: validData.name });
    const currentLabel = await Label.query().findById(req.params.id);

    if (currentLabel?.name === validData.name) {
      res.status(200).json(currentLabel);

      return;
    }

    if (existingLabel) {
      res.status(409).json({
        error: 'LabelAlreadyExists',
        message: 'Label with this name already exists',
      });

      return;
    }

    await currentLabel?.$query().patch(validData);

    res.status(200).json(currentLabel);
  },
  delete: async (req: Request, res: Response) => {
    await Label.query().deleteById(req.params.id);

    res.status(204).end();
  },
});
