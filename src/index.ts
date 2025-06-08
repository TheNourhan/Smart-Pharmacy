import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRoutes from './routes/auth';
import { AppDataSource } from './data-source';

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
  
app.use('/api/v1/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port: ${process.env.PORT || 3000}`);
});
