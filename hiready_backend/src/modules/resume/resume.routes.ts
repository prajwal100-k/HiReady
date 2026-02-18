import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from './resume.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.patch('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
