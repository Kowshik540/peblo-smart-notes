import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  shareNote
} from '../controllers/noteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.post('/:id/share', shareNote);

export default router;