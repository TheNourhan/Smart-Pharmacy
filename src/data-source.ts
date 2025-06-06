import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from './models/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username:  process.env.DB_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User], // Or [path.join(__dirname, '**/*.entity{.ts,.js}')]
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  subscribers: [],
});


