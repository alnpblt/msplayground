import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.provider';
import { SequelizeModule } from 'src/common/sequelize/sequelize.module';

@Module({
  imports: [SequelizeModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
})
export class UsersModule {}
