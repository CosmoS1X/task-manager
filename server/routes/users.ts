import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();
const controller = userController();

router.get('/users', controller.getList);
router.get('/users/:id', controller.getItem);
router.post('/users', controller.create);
router.patch('/users/:id', controller.update);
router.delete('/users/:id', controller.delete);
router.get('/check-email', controller.checkEmailAvailability);

export default router;
