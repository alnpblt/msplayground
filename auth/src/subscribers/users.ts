import { createSubscriber } from "../lib/rabbitmq";

const subscriber = createSubscriber();

subscriber.subscribe((message) => {
  console.log(message);
}, {
  exchangeName: 'USERS_SERVICE',
  exchangeType: 'fanout',
});

export default subscriber;