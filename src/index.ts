import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRoutes from './routes/auth';
import empRoutes from './routes/emp';
import patientRoutes from './routes/patient';
import prescriptionsRoutes from './routes/prescription';
import { AppDataSource } from './data-source';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
  
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', empRoutes);
app.use('/api/v1', patientRoutes);
app.use('/api/v1/prescriptions', prescriptionsRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port: ${process.env.PORT || 3000}`);
});
