import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import usersRouter from './routes/users.js';
import injectBroker from './middlewares/inject-broker.js';
import injectLogger from './middlewares/inject-logger.js';
import exceptionHandler from './exceptions/handler.js';
import RabbitMQ, { createListener, createPublisher } from './lib/rabbitmq.js';
import Logger from './utils/logger.js';

const app = express();

app.use(express.json({limit: '500mb'}));
app.use(injectBroker);
app.use(injectLogger);

app.use('/users', usersRouter); 

app.use(exceptionHandler);

app.listen(process.env.APP_PORT, async () => {

    const publisher = createPublisher({url: process.env.RABBITMQ_URL, logger: new Logger({moduleName: 'Publisher'})});
    // publisher(JSON.stringify({route: 'test', data: 'hello'}), {routingKey: 'AUTH_SERVICE'});
    publisher(JSON.stringify({ data: 'hello'}), {exchangeName: 'test_exchange_direct', exchangeType: 'direct'});

  console.log(`App is running on ${process.env.APP_PORT}`);
});
