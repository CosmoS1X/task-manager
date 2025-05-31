import { Router } from 'express';
import { statusController } from '../controllers';
import { authRequired } from '../middlewares';

const router = Router();
const controller = statusController();

router.get('/statuses', authRequired, controller.getList);
router.get('/statuses/:id', authRequired, controller.getItem);
router.post('/statuses', authRequired, controller.create);
router.patch('/statuses/:id', authRequired, controller.update);
router.delete('/statuses/:id', authRequired, controller.delete);

export default router;
