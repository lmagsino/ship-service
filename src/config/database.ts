import 'reflect-metadata';
import { DataSource } from 'typeorm'
import dotenv from 'dotenv';
import Ship from '../modules/ship/ship.model'
import Role from '../modules/role/role.model'

dotenv.config()

const DATASOURCE_TYPE = 'postgres';

const AppDataSource = new DataSource({
  type: DATASOURCE_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Ship, Role],
  synchronize: true,
  logging: false
})

export default AppDataSource;
