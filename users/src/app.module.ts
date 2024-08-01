import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from './common/sequelize/sequelize.module';
import serviceExchangeConfig from './configs/rabbitmq/service-exchange.config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serviceExchangeConfig],
    }),
    SequelizeModule,
    RabbitmqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
