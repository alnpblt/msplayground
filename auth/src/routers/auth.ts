import { createRouter } from "../lib/rabbitmq";

const router = createRouter();

router.route('test', () => {});

export default router;