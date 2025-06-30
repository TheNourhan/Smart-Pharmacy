import { addPrescriptionMedications, createPrescription, deleteMedication, deletePrescriptions, getMyPrescriptions, getPrescription, getPrescriptionMedications, updateMedication, updatePrescriptions } from '@/controller/prescriptionController';
import { authMiddleware } from '@/middleware/authMiddleware';
import express from 'express';
import upload from '@/middleware/uploadMiddleware';
const router = express.Router();


router.post('/', authMiddleware, upload.single('image'), createPrescription);
router.get('/', authMiddleware, getMyPrescriptions); 
router.get('/:id', authMiddleware, getPrescription);
router.put('/:id', authMiddleware, upload.single('image'), updatePrescriptions);
router.delete('/:id', authMiddleware, deletePrescriptions);
router.get('/:id/medications', authMiddleware, getPrescriptionMedications);
router.post('/:id/medications', authMiddleware, addPrescriptionMedications);
router.put('/medications/:id', authMiddleware, updateMedication);
router.delete('/medications/:id', authMiddleware, deleteMedication);

export default router;
