import { Router } from 'express';
import { statusController } from '../controllers';
import { authRequired } from '../middlewares';
import Endpoints from '../endpoints';

const router = Router();
const controller = statusController();

router.get(Endpoints.Statuses, authRequired, controller.getList);
router.get(Endpoints.Status, authRequired, controller.getItem);
router.post(Endpoints.Statuses, authRequired, controller.create);
router.patch(Endpoints.Status, authRequired, controller.update);
router.delete(Endpoints.Status, authRequired, controller.delete);

export default router;
