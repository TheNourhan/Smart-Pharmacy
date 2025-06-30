import { createAvailability, deleteAvailability, getAppointment, getAvailability, getEmpProfile, getMyAppointments, updateAvailability, updateEmp } from '@/controller/empController';
import { authMiddleware } from '@/middleware/authMiddleware';
import express from 'express';

const router = express.Router();

router.get('/me', authMiddleware, getEmpProfile);
router.put('/me', authMiddleware, updateEmp);

router.post('/availability', authMiddleware, createAvailability);
router.get('/availability', authMiddleware, getAvailability);
router.patch('/availability/:id', authMiddleware, updateAvailability);
router.delete('/availability/:id', authMiddleware, deleteAvailability);

router.get('/appointments', authMiddleware, getMyAppointments);
router.get('/appointments/:id', authMiddleware, getAppointment);

export default router;
