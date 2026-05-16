import express from 'express';
import { generateSummary } from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id/generate-summary', authMiddleware, generateSummary);

export default router;