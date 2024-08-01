import 'dotenv/config';
import { Dialect } from 'sequelize';
import * as models from '../database/models/index';

export const settings = {
  dialect: <Dialect>process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS, 
  database: process.env.DB_DATABASE,
  logging: false,
  timezone: '+00:00',
  models: Object.keys(models).map(model => models[model]),
  define: {
    charset: 'utf8',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
}