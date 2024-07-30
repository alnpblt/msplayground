import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: process.env.SERVICE_NAME,
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [
    //         `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    //       ],
    //       queue: 'user_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [],
  providers: [],
})
export class RabbitmqModule {}
