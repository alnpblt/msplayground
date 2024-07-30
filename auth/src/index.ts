import 'dotenv/config';
import { createServer } from './lib/rabbitmq';
import Logger from './utils/logger';
import authRouter from './routers/auth';
import usersSubscriber from './subscribers/users';

(async () => {
  const app =  await createServer({
    url: process.env.RABBITMQ_URL,
    queue: process.env.SERVICE_NAME,
    logger: new Logger({moduleName: 'RMQServer'}),
    verbose: true
  });

  app.useRouter(authRouter);

  app.useSubscriber(usersSubscriber);

  app.listen(() => {
    console.log('Auth service started.');
  });
})();



