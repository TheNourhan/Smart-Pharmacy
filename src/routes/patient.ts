import { createAppointment, getAllAvailabilities, getAppointment, getMyAppointments } from '@/controller/patientController';
import { authMiddleware } from '@/middleware/authMiddleware';
import express from 'express';

const router = express.Router();

router.post('/appointments', authMiddleware, createAppointment);
router.get('/appointments/:id', authMiddleware, getAppointment);
router.get('/appointments', authMiddleware, getMyAppointments);

router.get('/availabilities', authMiddleware, getAllAvailabilities);


export default router;
