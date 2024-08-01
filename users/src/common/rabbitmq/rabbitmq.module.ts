import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          exchanges: [
            {
              name: process.env.SERVICE_NAME,
              type: 'fanout',
              createExchangeIfNotExists: true,
              exchangeOptions: { durable: true },
            },
          ],
          uri: process.env.RMQ_URL,
        };
      },
    }),
  ],
  exports: [RabbitMQModule],
  controllers: [],
  providers: [],
})
export class RabbitmqModule {}
