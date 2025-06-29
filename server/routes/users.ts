import { Router } from 'express';
import { userController } from '../controllers';
import { authRequired, ownerOnly } from '../middlewares';
import Endpoints from '../endpoints';

const router = Router();
const controller = userController();

router.get(Endpoints.Users, authRequired, controller.getList);
router.get(Endpoints.User, authRequired, ownerOnly, controller.getItem);
router.post(Endpoints.Users, controller.create);
router.patch(Endpoints.User, authRequired, ownerOnly, controller.update);
router.delete(Endpoints.User, authRequired, ownerOnly, controller.delete);
router.get(Endpoints.CheckEmail, controller.checkEmailAvailability);

export default router;
