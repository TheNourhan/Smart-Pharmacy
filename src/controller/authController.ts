import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppDataSource } from '../data-source';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: 'active' 
    });

    await userRepository.save(user);

    return res.status(201).json({ message: 'User registered' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
    return res.status(500).json({ message: 'Registration failed', error: String(error) });
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
