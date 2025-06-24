import { addPrescriptionMedications, createPrescription, deletePrescriptions, getAllPrescriptions, getPrescription, getPrescriptionMedications, updatePrescriptions } from '@/controller/prescriptionController';
import { authMiddleware } from '@/middleware/authMiddleware';
import express from 'express';
import upload from '@/middleware/uploadMiddleware';
const router = express.Router();


router.post('/', authMiddleware, upload.single('image'), createPrescription);
router.get('/', authMiddleware, getAllPrescriptions); 
router.get('/:id', authMiddleware, getPrescription);
router.put('/:id', authMiddleware, updatePrescriptions);
router.delete('/:id', authMiddleware, deletePrescriptions);
router.get('/:id/medications', authMiddleware, getPrescriptionMedications);
router.post('/:id/medications', authMiddleware, addPrescriptionMedications);

export default router;
