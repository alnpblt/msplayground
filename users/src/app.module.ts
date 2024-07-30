import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from './common/sequelize/sequelize.module';

@Module({
  imports: [
    UsersModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
