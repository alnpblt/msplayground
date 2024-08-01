import { createSubscriber, SubscribeMessage } from "../lib/rabbitmq";
import * as usersService from '../services/user-service';

const subscriber = createSubscriber();

subscriber.subscribe({
  exchange: [
    {
      name: 'DATA_SYNC',
      type: 'topic',
      routingKey: 'users.*', 
      options: {durable: false}
    } 
  ],
  queue: {
    name: `${process.env.SERVICE_NAME}_DATA_SYNC`,
    options: {durable: true}
  },
  callback: async (message, channel) => {
    console.log(88888)
    const {properties, fields} = message;

    let payload: Record<string, any> = JSON.parse(message.content.toString()); 

    switch(fields.routingKey) {
      case 'users.createUser':
        await usersService.createUser(payload);
        break;
      default:
        break;
    }

    channel.ack(message);
  },
});

export default subscriber;