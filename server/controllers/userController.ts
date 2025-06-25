import type { Request, Response } from 'express';
import { User } from '../models';

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
    const validData = User.fromJson(req.body);
    const existingUser = await User.query().findOne({ email: validData.email });

    if (existingUser) {
      res.status(409).json({
        error: 'UserAlreadyExists',
        message: 'User with this email already exists',
      });

      return;
    }

    const newUser = await User.query().insert(validData);

    req.logIn(newUser, (err) => {
      if (err) {
        res.status(500).json({
          error: 'LoginFailed',
          message: 'Failed to log in newly created user',
        });

        return;
      }

      res.status(201).json(newUser);
    });
  },
  update: async (req: Request, res: Response) => {
    const { currentPassword, newPassword, ...updateData } = req.body;
    const currentUser = await User.query().findById(req.params.id);

    if (!currentUser) {
      res.status(404).json({
        error: 'UserNotFound',
        message: 'User not found',
      });

      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          error: 'CurrentPasswordRequired',
          message: 'Current password is required to change password',
        });

        return;
      }

      if (!currentUser?.verifyPassword(currentPassword)) {
        res.status(403).json({
          error: 'InvalidPassword',
          message: 'Current password is incorrect',
        });

        return;
      }
    }

    const validData = {
      ...updateData,
      ...(newPassword && { password: newPassword }),
    };

    await currentUser.$query().patch(validData);

    res.status(200).json(currentUser);
  },
  delete: async (req: Request, res: Response) => {
    await User.query().deleteById(req.params.id);

    req.logOut((error) => {
      if (error) {
        res.status(500).json({
          error: 'LogoutFailed',
          message: 'Failed to log out',
        });
        return;
      }

      res.status(204).end();
    });
  },
  checkEmailAvailability: async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Invalid Email' });
      return;
    }

    try {
      const user = await User.query().findOne({ email });
      res.status(200).json({ isAvailable: !user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
});
