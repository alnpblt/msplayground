import RabbitMQ, {createPublisher, createListener, createRPC} from "../lib/rabbitmq.js"
import Logger from "../utils/logger.js";

export default async (req, res, next) => {
  const logger = new Logger({moduleName: 'RABBITMQ'});
  req.app.broker = {
    emit: createPublisher({logger, url: process.env.RABBITMQ_URL}),
    send: createRPC({logger, url: process.env.RABBITMQ_URL, timeout: 30000})
  }
  
  next();
}