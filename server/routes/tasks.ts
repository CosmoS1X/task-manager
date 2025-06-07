import { Router } from 'express';
import { taskController } from '../controllers';
import { authRequired } from '../middlewares';

const router = Router();
const controller = taskController();

router.get('/tasks', authRequired, controller.getList);
router.get('/tasks/:id', authRequired, controller.getItem);
router.post('/tasks', authRequired, controller.create);
router.patch('/tasks/:id', authRequired, controller.update);
router.delete('/tasks/:id', authRequired, controller.delete);

export default router;
