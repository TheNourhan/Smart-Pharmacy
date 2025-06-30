import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Employee, Availability } from '@/entity/Employee';
import { Appointment } from '@/entity/Patient';
import { User } from '@/entity/User';

/**
 * Creates a new availability entry for an employee.
 * 
 * @param req - Express request object containing the employee ID and availability times in the body.
 * @param res - Express response object used to send the result of the creation process.
 * @returns A JSON response indicating success or failure, and the created availability data on success.
 */

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const employeeRepo = AppDataSource.getRepository(Employee);
    const availabilityRepo = AppDataSource.getRepository(Availability);

    const employee = await employeeRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if availability already exists for this employee
    const existing = await availabilityRepo.findOne({
      where: {
        employee: { id: employee.id },
        date,
        startTime,
        endTime,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This availability slot already exists for the employee',
      });
    }

    const availability = availabilityRepo.create({
      date,
      startTime,
      endTime,
      status: 'av',
      employee,
    });

    await availabilityRepo.save(availability);

    return res.status(201).json({
      success: true,
      message: 'Availability created',
      availability,
    });
  } catch (error) {
    console.error('Create availability error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

/**
 * Retrieves the availability entries for a specific employee.
 *
 * @param req - Express request object containing the employee ID as a query parameter.
 * @param res - Express response object used to send the list of availabilities or an error message.
 * @returns A JSON response with the employee's availabilities or an error status.
 */
export const getAvailability = async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.query.employeeId);

    if (isNaN(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const availabilityRepo = AppDataSource.getRepository(Availability);

    const availabilities = await availabilityRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return res.status(200).json({ success: true,  availabilities });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getEmpProfile = async (req: Request, res: Response) => {
  const employeeRepo = AppDataSource.getRepository(Employee);
  const userId = (req as any).user.id;

  try {
    const employee = await employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

   const { password, otpCode, otpActiveAt, deletedAt, ...safeUser } = employee.user;
  const safeEmployee = {
    ...employee,
    user: safeUser,
  };

  res.json({ success: true, employee: safeEmployee });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateEmp = async (req: Request, res: Response) => {
  const employeeRepo = AppDataSource.getRepository(Employee);
  const userRepo = AppDataSource.getRepository(User);
  const userId = (req as any).user.id;

  try {
    const employee = await employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!employee || !employee.user) {
      return res.status(404).json({
        success: false,
        message: 'Employee or related user not found',
      });
    }

    // Extract nested user data
    const userData = req.body.user || {};

    // Update user fields safely
    const userUpdates = ['firstName', 'lastName', 'phone', 'email'];
    for (const key of userUpdates) {
      if (key in userData) {
        (employee.user as any)[key] = userData[key];
      }
    }

    await userRepo.save(employee.user); // Save user changes

    // Update employee fields (e.g., hourlySalary)
    employeeRepo.merge(employee, req.body);
    const updatedEmployee = await employeeRepo.save(employee);

    // Sanitize output
    const {
      password,
      otpCode,
      otpActiveAt,
      deletedAt,
      status,
      isActive,
      isPhoneVerified,
      isEmailVerified,
      ...safeUser
    } = updatedEmployee.user;

    const safeEmployee = {
      ...updatedEmployee,
      user: safeUser,
    };

    res.json({ success: true, employee: safeEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  const availabilityRepo = AppDataSource.getRepository(Availability);
  const id = parseInt(req.params.id);

  try {
    const availability = await availabilityRepo.findOneBy({ id });

    if (!availability) {
      return res.status(404).json({ success: false, message: 'Availability not found' });
    }

    availabilityRepo.merge(availability, req.body);
    const updated = await availabilityRepo.save(availability);

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: updated});
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update availability' });
  }
};

/**
 * need to check first if the availability is linked to any appointment
 * If it is, we should not delete it, or we can set the status to 'cancelled' instead of deleting it.
 * If it is not linked to any appointment, we can delete it permanently.
 */
export const deleteAvailability = async (req: Request, res: Response) => {
  const availabilityRepo = AppDataSource.getRepository(Availability);
  const id = parseInt(req.params.id);

  try {
    const availability = await availabilityRepo.findOneBy({ id });

    if (!availability) {
      return res.status(404).json({ success: false, message: 'Availability not found' });
    }

    await availabilityRepo.remove(availability); // Permanently delete

    res.json({ success: true, message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete availability' });
  }
};

export const getMyAppointments = async (req: Request, res: Response) => {
  const appointmentRepo = AppDataSource.getRepository(Appointment);
  const employeeRepo = AppDataSource.getRepository(Employee);

  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const employee = await employeeRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const [appointments, total] = await appointmentRepo.findAndCount({
      where: { employee: { id: employee.id } },
      relations: ['employee', 'patient', 'availability'],
      skip,
      take: limit,
    });

    res.json({
      success: true,
      data: appointments,
      currentPage: page,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      limit: limit,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
};


export const getAppointment = async (req: Request, res: Response) => {
  const appointmentRepo = AppDataSource.getRepository(Appointment);
  const employeeRepo = AppDataSource.getRepository(Employee);
  const id = parseInt(req.params.id);
  const userId = (req as any).user.id;

  try {
    const employee = await employeeRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
    
    const appointment = await appointmentRepo.findOne({
      where: {
        id,
        employee: { id: employee.id },
      },
      relations: ['employee', 'patient', 'availability'], // optional
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch appointment' });
  }
};
