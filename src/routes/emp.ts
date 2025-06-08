import { createAvailability, getAvailability } from '@/controller/empController';
import { authMiddleware } from '@/middleware/authMiddleware';
import express from 'express';

const router = express.Router();

router.post('/availability', authMiddleware, createAvailability);
router.get('/availability', authMiddleware, getAvailability);

export default router;
