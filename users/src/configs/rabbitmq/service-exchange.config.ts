export default () => ({
  rmqServiceExchange: {
    uri: process.env.RMQ_URL,
    exchange: process.env.SERVICE_NAME,
    exchangeType: 'fanout',
    queue: process.env.SERVICE_NAME,
  },
});
