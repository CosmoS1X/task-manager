import { Router } from 'express';
import { userController } from '../controllers';
import { authRequired, ownerOnly } from '../middlewares';

const router = Router();
const controller = userController();

router.get('/users', authRequired, controller.getList);
router.get('/users/:id', authRequired, ownerOnly, controller.getItem);
router.post('/users', controller.create);
router.patch('/users/:id', authRequired, ownerOnly, controller.update);
router.delete('/users/:id', authRequired, ownerOnly, controller.delete);
router.get('/check-email', controller.checkEmailAvailability);

export default router;
