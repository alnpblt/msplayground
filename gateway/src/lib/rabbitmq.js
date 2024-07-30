import amqplib from 'amqplib';

export const ExchangeTypes = {
  DIRECT: 'direct',
  FANOUT: 'fanout',
  TOPIC: 'topic',
  HEADERS: 'headers',
}

/**
 * RabbitMQ wrapper that uses amqplib under the hood
 */
export default class RabbitMQ {
  /**
   * 
   * @param {object} options 
   * @param {string=} options.url RabbitMQ URL
   * @param {(Logger|console)=} options.logger Customer logger that implement console log method
   * @param {boolean=} options.verbose Display logs 
   * @param {object=} options.connectionHandler Event handlers regarding connection
   * @param {object=} options.channelHandler Event handlers regarding channel
   */
  constructor({url, logger, verbose, connectionHandler, channelHandler}){
    this._url = url;
    this._connection = null;
    this._channel = null;
    this._logger = logger;
    this._verbose = verbose ?? false;

    this._connectionHandler = {
      error: (e) => {
        this.logger.log(`connection error: ${JSON.stringify(e)}`);
      },
      close: (e) => {
        if(this._verbose) this.logger.log('connection closed');
      },
      blocked: (e) => {
        if(this._verbose) this.logger.log(`connection blocked event`);
      },
      unblocked: (e) => {
        if(this._verbose) this.logger.log('connection unblocked event');
      },
      updateSecretOk: (e) => {
        if(this._verbose) this.logger.log(`connection update secret ok event`);
      },
    };
    if(connectionHandler !== undefined) this._connectionHandler = {...this._connectionHandler, ...connectionHandler};

    this._channelHandler = {
      error: (e) => {
        this.logger.log(`channel error: ${JSON.stringify(e)}`);
      },
      close: (e) => {
        if(this._verbose)  this.logger.log('channel closed event');
      },
      return: (e) => {
        if(this._verbose)  this.logger.log('channel return event');
      },
      drain: (e) => {
        if(this._verbose) this.logger.log('channel drain event');
      },
    }
    if(connectionHandler !== undefined) this._channelHandler = {...this._channelHandler, ...channelHandler};
  }

  set verbose(verbose){
    this._verbose = verbose;
  }
  get logger(){
    return this._logger ?? console;
  }

  connectionHandler(handler){
    if(handler !== undefined){
      this._connectionHandler = {
        ...this._connectionHandler,
        ...handler,
      };
    }
    if (this.connection !== undefined && this.connection !== null) {
      this.connection.on('error', this._connectionHandler?.error);
      this.connection.on('close', this._connectionHandler?.close);
      this.connection.on('blocked', this._connectionHandler?.blocked);
      this.connection.on('unblocked', this._connectionHandler?.unblocked);
      this.connection.on('update-secret-ok', this._connectionHandler?.updateSecretOk);
    }
  }

  /**
   * Connect to RabbitMQ server
   * @param {(string|{
   * error: CallableFunction
   * close: CallableFunction
   * blocked: CallableFunction
   * unblocked: CallableFunction
   * updateSecretOk: CallableFunction
   * })=} url Connection URL to RabbitMQ server. 
   * @example ```amqp://{user}:{pass}@{host}:{port}/{vhost}```
   * @param {({
   * error: CallableFunction
   * close: CallableFunction
   * blocked: CallableFunction
   * unblocked: CallableFunction
   * updateSecretOk: CallableFunction
   * })=} handler Callback function to handle connection event
   * @param {CallableFunction} handler.error Error handler
   * @param {CallableFunction} handler.close Close handler
   * @param {CallableFunction} handler.blocked Blocked handler
   * @param {CallableFunction} handler.unblocked Unblocked handler
   * @param {CallableFunction} handler.updateSecretOk UpdateSecretOk handler
   * @returns 
   */
  async connect(url, handler){
    try{
      if(this._verbose) this._logger.error(`connecting to rabbitmq server`);
      this._connection = await amqplib.connect(typeof url === 'string' ? url : this._url);
      if(this._verbose) this._logger.error(`successfully connected`);

      if(typeof url !== 'string' && typeof url !== 'undefined'){
        this.connectionHandler(url);
      } else {
        this.connectionHandler(handler);
      }
      

      return this;
    }catch(error){
      throw new Error(`Unable to connect to rabbitmq`, {cause: error})
    }
  }


  get connection(){
    return this._connection;
  }

  channelHandler(handler){
    if(handler !== undefined){
      this._channelHandler = {
        ...this._channelHandler,
        ...handler,
      };
    }
    if (this._channel !== undefined && this._channel !== null) {
      this.channel.on('error', this._channelHandler?.error);
      this.channel.on('close', this._channelHandler?.close);
      this.channel.on('return', this._channelHandler?.return);
      this.channel.on('drain', this._channelHandler?.drain);
    }
  }

  get channel(){
    return this._channel;
  }

  /**
   * Create RabbitMQ channel
   * @param {({
   * error: CallableFunction
   * close: CallableFunction
   * return: CallableFunction
   * drain: CallableFunction
  * })=} handler Callback function to handle channel event
   * @param {CallableFunction} handler.error Error handler
   * @param {CallableFunction} handler.close Close handler
   * @param {CallableFunction} handler.return Close handler
   * @param {CallableFunction} handler.drain Close handler
   * @returns
   */
  async createChannel(handler){
    try{
      this._channel = await this.connection.createChannel();

      if(this._verbose) this._logger.error(`created channel`);

      this.channelHandler(handler);

      return this._channel;
    }catch(error){
      throw new Error(`Unable to create channel`, {cause: error})
    }
  }

  /**
   * Create RabbitMQ queue
   * @param {string} queueName Queue name
   * @param {object=} props Queue properties
   * @param {boolean} props.durable Durable queue
   * @param {boolean} props.autoDelete Auto delete queue
   * @param {boolean} props.exclusive Exclusive queue
   * @returns 
   */
  async createQueue(queueName, options = {}) {
    try {
      const queue = await this._channel.assertQueue(queueName, options);

      if(this._verbose) this._logger.error(`created queue: ${queue.queue}`);
      
      return queue;
    } catch (error) {
      throw new Error(`Unable to create queue`, {cause: error});
    }
  }

  /**
   * Create RabbitMQ exchange
   * @param {string} exchangeName Exchange name
   * @param {keyof ExchangeTypes} type Exchange type. 
   * @param {object} options Exchange options. See {@link https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange|AQMP Exchange}
   * @returns 
   */
  async createExchange(exchangeName, type, options = {}){
    if(!Object.values(ExchangeTypes).includes(type)){
      throw new Error('Invalid exchange type');
    }

    try {
      const exchange = await this._channel.assertExchange(exchangeName, type, options);

      if(this._verbose) this._logger.error(`created exchange: ${exchange.exchange} using ${type.toUpperCase()}`);

      return exchange;
    } catch (error) {
      throw new Error(`Unable to create exchange`, {cause: error});
    }
  }

  /**
   * Bind queue to exchange
   * @param {string} queueName Queue name
   * @param {string} exchangeName Exchange name
   * @param {string=} route Routing key name
   * @returns 
   */
  async bindQueue(queueName, exchangeName, route = '') {
    try {
      const bindQueue = await this.channel.bindQueue(queueName, exchangeName, route);
      
      if(this._verbose) this.logger.log(`binded ${queueName} queue to ${exchangeName} exchange in ${route ? `${route} route` : ''}`);
      
      return bindQueue;
    } catch (error) {
      throw new Error(`Unable to bind queue`, {cause: error})
    }
  }

  /**
   * Send message to RabbitMQ queue/exchange
   * @param {string=} exchange Exchange name where to send message
   * @param {string} routingKey Queue/Route name where to send message
   * @param {string} content Message to be send to queue name
   * @param {object=} options AMQP publish options. See {@link https://amqp-node.github.io/amqplib/channel_api.html#channel_publish|AMQP Publish}
   * @returns
   */
  send(exchange, routingKey, content, options){
    try{
      const publish = this.channel.publish(exchange, routingKey, Buffer.from(content), options);
      
      if(this._verbose) this.logger.log(`published message to ${exchange !== undefined ? `${exchange} exchange with`: ''} ${exchange !== undefined ? `${routingKey} routing key` : `${routingKey} queue`}`);
      
      return publish;
    }catch(error){
      this.logger.log('Unable to publish messagee', {cause: error});
    }
  }

  /**
   * Consume/listen message from the queue
   * @param {string} queueName Queue name
   * @param {CallableFunction} callback Callback function to consume message
   * @param {object} options Consume options. See {@link https://amqp-node.github.io/amqplib/channel_api.html#channel_consume|AMQP Consume}
   */
  listen(queueName, callback, options = {}) {
    try {
      this.channel.consume(
        queueName,
        callback,
        options
      );

      if(this._verbose) this.logger.log(`listening to ${queueName} queue`);
    } catch (error) {
      throw new Error(`Unable to initiate listener`, {cause: error});
    }
  }

  /**
   * Close channel and connection to RabbitMQ
   */
  async close() {
    try {
      if (this.channel !== undefined && this.channel !== null) {
        await this.channel.close();
      }
      if (this.connection !== undefined && this.connection !== null) {
        await this.connection.close();
      }
    } catch (error) {
      throw new Error('Unable to close connection', {cause: error});
    }
  }

  generateCorrelationId(){
    let datetime = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (datetime + Math.random()*16)%16 | 0;
        datetime = Math.floor(datetime/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
}

/**
 * Generate RabbitMQ publisher
 * @param {object} options
 * @param {string} options.url RabbitMQ URL
 * @param {(Logger|console)=} options.logger Customer logger that implement console log method
 * @returns {(content: string, option: object): any}
 */
export const createPublisher = ({url, logger}) => {
  return (content, {routingKey, exchangeName, exchangeType, exchangeOptions, ...option} = {}) => {
    (async() => {
      const broker = await new RabbitMQ({url, logger, verbose: true}).connect();
      await broker.createChannel();
      if(exchangeName !== undefined && exchangeType !== undefined){
        await broker.createExchange(exchangeName, exchangeType ?? ExchangeTypes.FANOUT, exchangeOptions ?? {
          durable: false,
        });
      }
      broker.send(exchangeName, routingKey, content, option);
      broker.close();
    })();
  };
}

/**
 * Generate RabbitMQ RPC (request-response)
 * @param {object} options
 * @param {string} options.url RabbitMQ URL
 * @param {number} options.timeout Response timeout in milliseconds
 * @param {(Logger|console)=} options.logger Customer logger that implement console log method
 * @returns {(content: string, routingKey: string) => Promise<any>}
 */
export const createRPC = ({url, logger, timeout}) => {
  return (content, routingKey = '') => {
    return (async() => {
      const broker = await new RabbitMQ({url, logger, verbose: true}).connect();
      await broker.createChannel();
      
      return new Promise(async (resolve, reject) => {
        let responseTimeout = null;

        try{
          const correlationId = broker.generateCorrelationId();
          const queue = await broker.createQueue('', {exclusive: true});
          
          broker.listen(queue.queue, (message) => {
            if(message.properties.correlationId === correlationId){
              message.content = message.content.toString();
              clearTimeout(responseTimeout);
              resolve(message);
              broker.close();
            }
          });
    
          broker.send(undefined, routingKey, content, {
            replyTo: queue.queue,
            correlationId: correlationId,
          });
        }catch(error){
          reject(error);
        }

        responseTimeout = setTimeout(() => {
          reject(new Error('The timeout period elapsed prior to completion of the operation or the server is not responding.'));
          broker.close();
        }, timeout ?? 30000);
      });
    })();
  };
}

/**
 * Generate RabbitMQ listener
 * @param {object} options
 * @param {RabbitMQ} options.context RabbitMQ instance
 * @param {string} options.queue Queue name
 * @param {string=} options.exchange Exchange name
 * @param {string=} options.exchangeType Exchange type
 * @param {string=} options.routingKey Routing key
 * @param {string} options.url RabbitMQ URL
 * @param {(Logger|console)=} options.logger Customer logger that implement console log method
 * @returns {(callback: CallableFunction, options: object) => void}
 */
export const createListener = async ({context, queue, exchange, exchangeType, routingKey, url, logger}) => {
  let broker = context;
  if(broker === undefined){
    broker = new RabbitMQ({url, logger, verbose: true});
  }
  const startBroker = async () => {
    if(broker.connection === undefined || broker.connection === null){
      await broker.connect({
        close: startBroker,
      });
    }
    if(broker.channel === undefined || broker.channel === null){
      await broker.createChannel();
    }
    
    await broker.createQueue(queue, {durable: false});
    if(exchange !== undefined && exchange !== null){
      await broker.createExchange(exchange, exchangeType, {durable: false});
      await broker.bindQueue(queue, exchange, routingKey ?? '');
    };
  }

  await startBroker();
  
  return (callback, options) => {
    broker.listen(queue, callback, options);
  };
}

/**
 * Generate a server that utilize RabbitMQ under the hood
 * @param options 
 * @param options.queue Queue name
 * @param options.url RabbitMQ URL
 * @param options.logger Customer logger that implement console log method
 * @param options.verbose Enable verbose mode
 * @returns {BrokerServer}
 */
export const createServer = ({queue, url, logger, verbose}) => {
  const broker = new RabbitMQ({url, logger, verbose});
  
  const serverEvent = new EventEmitter();

  return {
    context: broker,
    route: (event, callback) => {
      logger.log(`listening to route [${event}]`);
      serverEvent.on(event, callback);
    },
    subscribe: (callback, options) => {
      if(verbose) logger.log(`subscribed to [${options.exchangeName ?? options?.routeKey ?? ''}]${options.routeKey !== undefined ? `with [${options.routeKey}] route` : ''}`);
      (async () => {
        if(options.exchangeType !== undefined && options.exchangeName !== null){
          const newQueue = await broker.createQueue(`${queue}_${options.exchangeName}`, options.queueOptions);
          await broker.createExchange(options.exchangeName, options.exchangeType, options.exchangeOptions);
          await broker.bindQueue(newQueue.queue, options.exchangeName, options.routeKey);
          broker.listen(newQueue.queue, callback, options.subscribeOptions);
        }
      })();
    },
    listen: (callback) => {
      (async() => {
        await broker.connect({
          close: async () => {
            await broker.connect();
          }
        });
        await broker.createChannel();
        await broker.createQueue(queue, {durable: false});
        broker.listen(queue, (message) => {
          message.content = message.content.toString();
          try{
            message.content = JSON.parse(message.content);
          }catch(e){}
          
          serverEvent.emit(message.content.route, message);
        }, {
          noAck: true,
          noLocal: true,
          exclusive: true,
        });
        return callback();
      })();
    }
  }
}

/**
 * Generate message for NestJS RabbitMQ receiver
 * @param {any} content Message to be send in NestJS RabbitMQ receiver
 * @param {any} pattern NestJS pattern receiver
 * @returns {string}
 */
export const nestjsMessage = (content, pattern) => {
  return JSON.stringify({
    pattern: pattern, 
    id: new Date().getTime(), 
    data: content
  })
}; 