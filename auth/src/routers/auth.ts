import { createRouter } from "../lib/rabbitmq";
import * as authController from '../controllers/authenticate-controller';

const router = createRouter();

router.route('authenticate', authController.handleAuthenticateRoute);

export default router;