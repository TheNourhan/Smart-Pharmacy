import { Request, Response } from 'express';
import { AppDataSource } from '@/data-source';
import { Doctor, Hospital, Prescription } from '@/entity/Prescription';
import { Patient } from '@/entity/Patient';

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { doctorId, hospitalId, description } = req.body;

    const patientRepository = AppDataSource.getRepository(Patient);
    const patient = await patientRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    const imageURL = (req.file as any).location;

   const doctor = doctorId
      ? await AppDataSource.getRepository(Doctor).findOneBy({ doctorID: parseInt(doctorId) })
      : undefined;

    if (doctorId && !doctor) {
      return res.status(400).json({ success: false, error: 'Doctor not found with the given doctorId' });
    }

    const hospital = hospitalId
      ? await AppDataSource.getRepository(Hospital).findOneBy({ hospitalID: parseInt(hospitalId) })
      : undefined;

    if (hospitalId && !hospital) {
      return res.status(400).json({ success: false, error: 'Hospital not found with the given hospitalId' });
    }

    // Create and save the prescription
    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const prescriptionData: Partial<Prescription> = {
        description,
        imageURL,
        patient,
        doctor: doctor ?? undefined,   
        hospital: hospital ?? undefined,
    };

    const prescription = prescriptionRepo.create(prescriptionData);
    await prescriptionRepo.save(prescription);

    return res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription: {
        prescriptionID: prescription.prescriptionID,
        description: prescription.description,
        imageURL: prescription.imageURL,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt,
        patient: {
          id: patient.id,
          firstName: patient.user.firstName,
          lastName: patient.user.lastName,
        },
        doctorId: doctor ? doctor.doctorID : null,
        hospitalId: hospital ? hospital.hospitalID : null,
      },
    });

  } catch (err) {
    console.error('Create Prescription Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPrescription = async (req: Request, res: Response) => {
  
};

export const getAllPrescriptions = async (req: Request, res: Response) => {
  
};

export const updatePrescriptions = async (req: Request, res: Response) => {
  
};

export const deletePrescriptions = async (req: Request, res: Response) => {
  
};

export const getPrescriptionMedications = async (req: Request, res: Response) => {
  
};

export const addPrescriptionMedications = async (req: Request, res: Response) => {
  
};