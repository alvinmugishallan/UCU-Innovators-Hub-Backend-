import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Project } from './entities/Project';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME || 'ucu_innovators_hub.db',
  synchronize: true,
  logging: false,
  entities: [User, Project],
});
