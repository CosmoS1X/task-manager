import { Router } from 'express';
import { sessionController } from '../controllers';
import Endpoints from '../endpoints';

const router = Router();
const controller = sessionController();

router.post(Endpoints.Login, controller.login);
router.get(Endpoints.CheckAuth, controller.checkAuth);
router.post(Endpoints.Logout, controller.logout);

export default router;
