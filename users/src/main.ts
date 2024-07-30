import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
        ],
        queue: 'users_service',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory(errors) {
        throw new RpcException({
          code: HttpStatus.BAD_REQUEST,
          message: errors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints),
          })),
        });
      },
    }),
  );

  await app.listen();
}
bootstrap();
