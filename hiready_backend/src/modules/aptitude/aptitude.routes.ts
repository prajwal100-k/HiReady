import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createAptitudeTest,
  getAptitudeTests,
  getAptitudeTestById,
  getBestScore,
  deleteAptitudeTest,
} from './aptitude.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createAptitudeTest);
router.get('/', getAptitudeTests);
router.get('/best-score', getBestScore);
router.get('/:id', getAptitudeTestById);
router.delete('/:id', deleteAptitudeTest);

export default router;
