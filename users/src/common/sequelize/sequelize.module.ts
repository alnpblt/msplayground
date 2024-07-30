import { Module } from '@nestjs/common';
import { databaseProviders } from './sequelize.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class SequelizeModule {}
