import { UserType } from '../models/User';

declare global {
  namespace Express {
    interface User extends UserType {}

    interface Request {
      user?: User;
    }
  }
}
