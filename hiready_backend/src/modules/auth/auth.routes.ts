import { Router } from 'express';
import * as controller from './auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/session', authMiddleware, controller.session);

export default router;
