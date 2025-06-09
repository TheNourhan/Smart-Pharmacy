import { AppDataSource } from '@/data-source';
import { Availability } from '@/entity/Employee';
import { Appointment, Patient } from '@/entity/Patient';
import { Request, Response } from 'express';


let savedAppointment: Appointment | null = null;

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { empId, availabilityId } = req.body;

    if (!empId || !availabilityId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

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

    const availabilityRepository = AppDataSource.getRepository(Availability);
    const availability = await availabilityRepository.findOne({
      where: { id: availabilityId },
      relations: ['employee'],
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability slot not found',
      });
    }

    if (availability.status !== 'av') {
      return res.status(400).json({
        success: false,
        message: 'This availability slot is already booked or unavailable',
      });
    }

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const existingAppointment = await appointmentRepository.findOne({
      where: { availability: { id: availabilityId } },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This availability slot is already assigned to another appointment',
      });
    }


    await AppDataSource.transaction(async (manager) => {
    const appointment = manager.getRepository(Appointment).create({
        employee: { id: empId },
        patient: { id: patient.id },
        availability: { id: availability.id },
        status: 'scheduled',
    });

    savedAppointment = await manager.getRepository(Appointment).save(appointment);

    availability.status = 'scheduled';
    await manager.getRepository(Availability).save(availability);
    });

    return res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    appointment: savedAppointment
        ? {
            id: savedAppointment.id,
            status: savedAppointment.status,
            availabilityId: availability.id,
            patientId: patient.id,
            employeeId: empId,
        }
        : null,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID',
      });
    }

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepository.findOne({
      where: { id: Number(id) },
      relations: ['employee', 'patient', 'availability'],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Return sanitized appointment data
    return res.status(200).json({
      success: true,
      appointment: {
        id: appointment.id,
        status: appointment.status,
        employeeId: appointment.employee.id,
        patientId: appointment.patient.id,
        availabilityId: appointment.availability.id,
        date: appointment.availability.date,
        startTime: appointment.availability.startTime,
        endTime: appointment.availability.endTime,
      },
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const patientRepository = AppDataSource.getRepository(Patient);
    const patient = await patientRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const [appointments, total] = await appointmentRepository.findAndCount({
      where: { patient: { id: patient.id } },
      relations: ['employee', 'availability'],
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    const items = appointments.map((appointment) => ({
      id: appointment.id,
      status: appointment.status,
      employeeId: appointment.employee.id,
      availability: {
        id: appointment.availability.id,
        date: appointment.availability.date,
        startTime: appointment.availability.startTime,
        endTime: appointment.availability.endTime,
      },
    }));

    return res.status(200).json({
      success: true,
      items,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getAllAvailabilities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const availabilityRepository = AppDataSource.getRepository(Availability);

    const [availabilities, total] = await availabilityRepository.findAndCount({
      relations: ['employee'],
      skip,
      take: limit,
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    const data = availabilities.map((availability) => ({
      id: availability.id,
      empId: availability.employee.id,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: availability.status,
    }));

    return res.status(200).json({
      success: true,
      items: data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
