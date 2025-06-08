import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Employee, Availability } from '@/entity/Employee';

/**
 * Creates a new availability entry for an employee.
 * 
 * @param req - Express request object containing the employee ID and availability times in the body.
 * @param res - Express response object used to send the result of the creation process.
 * @returns A JSON response indicating success or failure, and the created availability data on success.
 */
export const createAvailability = async (req: Request, res: Response) => {
  try {
    const employeeId = (req as any).user.id;
    const { date, startTime, endTime} = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const employeeRepo = AppDataSource.getRepository(Employee);
    const availabilityRepo = AppDataSource.getRepository(Availability);

    const employee = await employeeRepo.findOneBy({ user: employeeId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const availability = availabilityRepo.create({
      date,
      startTime,
      endTime,
      status: 'av',
      employee,
    });

    await availabilityRepo.save(availability);

    return res.status(201).json({ success: true, message: 'Availability created', availability });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
