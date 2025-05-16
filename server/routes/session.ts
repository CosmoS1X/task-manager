import { Router } from 'express';
import sessionController from '../controllers/sessionController';

const router = Router();
const controller = sessionController();

router.post('/login', controller.login);
router.get('/check-auth', controller.checkAuth);
router.get('/logout', controller.logout);

export default router;
