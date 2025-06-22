import { Router } from 'express';
import { labelController } from '../controllers';
import { authRequired } from '../middlewares';
import Endpoints from '../endpoints';

const router = Router();
const controller = labelController();

router.get(Endpoints.Labels, authRequired, controller.getList);
router.get(Endpoints.Label, authRequired, controller.getItem);
router.post(Endpoints.Labels, authRequired, controller.create);
router.patch(Endpoints.Label, authRequired, controller.update);
router.delete(Endpoints.Label, authRequired, controller.delete);

export default router;
