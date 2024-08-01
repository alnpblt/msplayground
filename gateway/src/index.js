import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import injectBroker from './middlewares/inject-broker.js';
import injectLogger from './middlewares/inject-logger.js';
import exceptionHandler from './exceptions/handler.js';
import RabbitMQ, { createListener, createPublisher, createRPC } from './lib/rabbitmq.js';
import Logger from './utils/logger.js';

const app = express();

app.use(express.json({limit: '500mb'}));
app.use(injectBroker);
app.use(injectLogger);

app.use('/users', usersRouter); 

app.use('/auth', authRouter); 

app.use(exceptionHandler);

app.listen(process.env.APP_PORT, async () => {

    // const publisher = createPublisher({url: process.env.RABBITMQ_URL, logger: new Logger({moduleName: 'Publisher'})});
    // // publisher(JSON.stringify({route: 'test', data: 'hello'}), {routingKey: 'AUTH_SERVICE'});
    // publisher(JSON.stringify({ data: 'direct message'}), 'DATA_SYNC', 'users.createUser');

    // const rpc = createRPC({url: process.env.RABBITMQ_URL, logger: new Logger({moduleName: 'RPC'})});
    // const response = await rpc(JSON.stringify({route: 'login', data: {test: 1}}), 'AUTH_SERVICE')
    // console.log(response)

  console.log(`App is running on ${process.env.APP_PORT}`);
});
