import { Router } from 'express';
import { taskController } from '../controllers';
import { authRequired } from '../middlewares';
import Endpoints from '../endpoints';

const router = Router();
const controller = taskController();

router.get(Endpoints.Tasks, authRequired, controller.getList);
router.get(Endpoints.Task, authRequired, controller.getItem);
router.post(Endpoints.Tasks, authRequired, controller.create);
router.patch(Endpoints.Task, authRequired, controller.update);
router.delete(Endpoints.Task, authRequired, controller.delete);

export default router;
