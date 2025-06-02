import { Router } from 'express';
import { labelController } from '../controllers';
import { authRequired } from '../middlewares';

const router = Router();
const controller = labelController();

router.get('/labels', authRequired, controller.getList);
router.get('/labels/:id', authRequired, controller.getItem);
router.post('/labels', authRequired, controller.create);
router.patch('/labels/:id', authRequired, controller.update);
router.delete('/labels/:id', authRequired, controller.delete);

export default router;
