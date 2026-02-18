import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from './interview.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.patch('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
