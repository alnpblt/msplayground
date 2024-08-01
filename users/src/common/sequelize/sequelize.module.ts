import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './sequelize.provider';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class SequelizeModule {}
