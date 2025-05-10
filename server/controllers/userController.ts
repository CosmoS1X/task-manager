import type { Request, Response } from 'express';
import User from '../models/User';

export default () => ({
  getList: async (req: Request, res: Response) => {
    const users = await User.query();

    res.status(200).json(users);
  },
  getItem: async (req: Request, res: Response) => {
    const user = await User.query().findById(req.params.id);

    res.status(200).json(user);
  },
  create: async (req: Request, res: Response) => {
    try {
      const validData = User.fromJson(req.body);
      const existingUser = await User.query().where('email', validData.email).first();

      if (existingUser) {
        res.status(409).json({
          error: 'User already exists',
          message: 'User with this email already exists',
        });

        return;
      }

      const newUser = await User.query().insert(validData);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  },
  update: async (req: Request, res: Response) => {
    const user = await User.query().findById(req.params.id).patch(req.body);

    res.status(200).json(user);
  },
  delete: async (req: Request, res: Response) => {
    await User.query().deleteById(req.params.id);

    res.status(204).end();
  },
});
