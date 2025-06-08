import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/entity/User';
import { AppDataSource } from '../data-source';
import { Patient } from '@/entity/Patient';

/**
 * Registers a new user as a patient.
 * 
 * @param req - Express request object containing user registration data in the body.
 * @param res - Express response object used to send the result of the registration process.
 * @returns A JSON response indicating success or failure, and relevant user information on success.
 */
export const signUp = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const userRepository = queryRunner.manager.getRepository(User);
    const patientRepository = queryRunner.manager.getRepository(Patient);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      status: 'active',
      loginBy: 'email',
    });
    await queryRunner.manager.save(user);

    const patient = patientRepository.create({
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      user: user
    });

    await queryRunner.manager.save(patient);

    // Establish the relationship in both directions
    patient.user = user;
    user.patient = patient;

    // Save both entities
    await queryRunner.manager.save(patient);
    await queryRunner.manager.save(user);

    await queryRunner.commitTransaction();

    // Verify the relationship
    const savedUser = await userRepository.findOne({
      where: { id: user.id },
      relations: ['patient']
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser?.id,
        email: savedUser?.email,
        patientId: savedUser?.patient?.id
      }
    });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    await queryRunner.release();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRepository = AppDataSource.getRepository(User);

    // Find user by email
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
