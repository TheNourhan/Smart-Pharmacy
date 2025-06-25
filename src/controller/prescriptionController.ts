import { Request, Response } from 'express';
import { AppDataSource } from '@/data-source';
import { Doctor, Hospital, Prescription } from '@/entity/Prescription';
import { Patient } from '@/entity/Patient';
import s3 from '@/config/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Medication } from '@/entity/Medication';
import { Product } from '@/entity/Product';

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
  try {
    const userId = (req as any).user.id;
    const prescriptionId = parseInt(req.params.id);

    if (isNaN(prescriptionId)) {
      return res.status(400).json({ success: false, error: 'Invalid prescription ID' });
    }

    const patientRepo = AppDataSource.getRepository(Patient);
    const patient = await patientRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    // Fetch the prescription and check ownership
    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const prescription = await prescriptionRepo.findOne({
      where: {
        prescriptionID: prescriptionId,
        patient: { id: patient.id },
      },
      relations: ['patient', 'patient.user', 'doctor', 'hospital'],
    });

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found or unauthorized' });
    }

    const result = {
      prescriptionID: prescription.prescriptionID,
      description: prescription.description,
      imageURL: prescription.imageURL,
      createdAt: prescription.createdAt,
      updatedAt: prescription.updatedAt,
      patient: {
        id: prescription.patient.id,
        firstName: prescription.patient.user.firstName,
        lastName: prescription.patient.user.lastName,
      },
      doctor: prescription.doctor
        ? {
            doctorID: prescription.doctor.doctorID,
            firstName: prescription.doctor.firstName,
            lastName: prescription.doctor.lastName,
          }
        : null,
      hospital: prescription.hospital
        ? {
            hospitalID: prescription.hospital.hospitalID,
            name: prescription.hospital.hospitalName,
          }
        : null,
    };

    return res.status(200).json({
      message: 'Prescription retrieved successfully',
      prescription: result,
    });
  } catch (err) {
    console.error('Get Prescription Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMyPrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Find the patient linked to this user
    const patientRepo = AppDataSource.getRepository(Patient);
    const patient = await patientRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const prescriptionRepo = AppDataSource.getRepository(Prescription);

    // Get total count for pagination info
    const total = await prescriptionRepo.count({
      where: { patient: { id: patient.id } },
    });

    const prescriptions = await prescriptionRepo.find({
      where: { patient: { id: patient.id } },
      relations: ['patient', 'patient.user', 'doctor', 'hospital'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const result = prescriptions.map((prescription) => ({
      prescriptionID: prescription.prescriptionID,
      description: prescription.description,
      imageURL: prescription.imageURL,
      createdAt: prescription.createdAt,
      updatedAt: prescription.updatedAt,
      patient: {
        id: prescription.patient.id,
        firstName: prescription.patient.user.firstName,
        lastName: prescription.patient.user.lastName,
      },
      doctor: prescription.doctor
        ? {
            doctorID: prescription.doctor.doctorID,
            firstName: prescription.doctor.firstName,
            lastName: prescription.doctor.lastName,
          }
        : null,
      hospital: prescription.hospital
        ? {
            hospitalID: prescription.hospital.hospitalID,
            name: prescription.hospital.hospitalName,
          }
        : null,
    }));

    return res.status(200).json({
      message: 'Prescriptions retrieved successfully',
      prescriptions: result,
      currentPage: page,
      totalItems: total,
      itemsCount: prescriptions.length,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Get Prescriptions Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const prescriptionId = parseInt(req.params.id);
    const { description, doctorId, hospitalId } = req.body;

    if (isNaN(prescriptionId)) {
      return res.status(400).json({ success: false, error: 'Invalid prescription ID' });
    }

    const patientRepo = AppDataSource.getRepository(Patient);
    const patient = await patientRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const prescription = await prescriptionRepo.findOne({
      where: { prescriptionID: prescriptionId, patient: { id: patient.id } },
      relations: ['doctor', 'hospital', 'patient'],
    });

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found or unauthorized' });
    }

    if (description !== undefined) {
      prescription.description = description;
    }

    if (doctorId !== undefined) {
      const doctor = await AppDataSource.getRepository(Doctor).findOneBy({
        doctorID: parseInt(doctorId),
      });
      if (!doctor) {
        return res.status(400).json({ success: false, error: 'Doctor not found' });
      }
      prescription.doctor = doctor;
    }

    if (hospitalId !== undefined) {
      const hospital = await AppDataSource.getRepository(Hospital).findOneBy({
        hospitalID: parseInt(hospitalId),
      });
      if (!hospital) {
        return res.status(400).json({ success: false, error: 'Hospital not found' });
      }
      prescription.hospital = hospital;
    }

    // Update image if uploaded
    if (req.file) {
      const imageURL = (req.file as any).location;
      prescription.imageURL = imageURL;
    }

    await prescriptionRepo.save(prescription);

    return res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      prescriptionID: prescription.prescriptionID,
    });
  } catch (err) {
    console.error('Update Prescription Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deletePrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const prescriptionId = parseInt(req.params.id);

    if (isNaN(prescriptionId)) {
      return res.status(400).json({ success: false, error: 'Invalid prescription ID' });
    }

    const patient = await AppDataSource.getRepository(Patient).findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    // Find prescription belonging to patient
    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const prescription = await prescriptionRepo.findOne({
      where: { prescriptionID: prescriptionId, patient: { id: patient.id } },
      relations: ['patient'],
    });

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found or unauthorized' });
    }

    // Delete image from S3
    if (prescription.imageURL) {
      const bucket = process.env.AWS_BUCKET_NAME!;
      const key = prescription.imageURL.split(`${bucket}/`)[1]; // Get S3 object key

      if (key) {
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        } catch (s3Err) {
          console.warn('S3 delete warning:', s3Err);
        }
      }
    }

    // Delete prescription
    await prescriptionRepo.remove(prescription);

    return res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
      prescriptionID: prescription.prescriptionID,
    });
  } catch (err) {
    console.error('Delete Prescription Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getPrescriptionMedications = async (req: Request, res: Response) => {
  try {
    const prescriptionId = parseInt(req.params.id);

    if (isNaN(prescriptionId)) {
      return res.status(400).json({ success: false, error: 'Invalid prescription ID' });
    }

    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const prescription = await prescriptionRepo.findOne({
      where: { prescriptionID: prescriptionId },
    });

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    const medicationRepo = AppDataSource.getRepository(Medication);
    const medications = await medicationRepo.find({
      where: { prescription: { prescriptionID: prescriptionId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    const result = medications.map((med) => ({
      id: med.id,
      durationStart: med.durationStart,
      durationEnd: med.durationEnd,
      reasonForUse: med.reasonForUse,
      frequency: med.frequency,
      description: med.description,
      createdAt: med.createdAt,
      updatedAt: med.updatedAt,
      product: med.product
        ? {
            id: med.product.id,
            brandName: med.product.brandName,
            genericName: med.product.genericName,
            price: med.product.price,
            dosageForm: med.product.dosageForm,
            quantity: med.product.quantity,
            imageURL: med.product.imageURL,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      message: 'Medications retrieved successfully',
      medications: result,
    });
  } catch (err) {
    console.error('Get Medications Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const addPrescriptionMedications = async (req: Request, res: Response) => {
  try {
    const prescriptionId = parseInt(req.params.id);
    const medicationRepo = AppDataSource.getRepository(Medication);
    const prescriptionRepo = AppDataSource.getRepository(Prescription);
    const productRepo = AppDataSource.getRepository(Product);

    const prescription = await prescriptionRepo.findOneBy({ prescriptionID: prescriptionId });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    const medications = Array.isArray(req.body) ? req.body : [req.body];

    const toInsert: Medication[] = [];

    for (const med of medications) {
      const {
        productId,
        durationStart,
        durationEnd,
        reasonForUse,
        frequency,
        description,
      } = med;

      let product: Product | null = null;
      if (productId) {
        product = await productRepo.findOneBy({ id: productId });
        if (!product) {
          return res.status(400).json({ success: false, message: `Product with id ${productId} not found` });
        }
      }

      const medication = medicationRepo.create({
        prescription: prescription,
        product: product ?? undefined,
        durationStart,
        durationEnd,
        reasonForUse,
        frequency,
        description,
      });

      toInsert.push(medication);
    }

    await medicationRepo.save(toInsert);

    return res.status(201).json({
      success: true,
      message: 'Medications added successfully',
      medications: toInsert,
    });
  } catch (err) {
    console.error('Add Medications Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};