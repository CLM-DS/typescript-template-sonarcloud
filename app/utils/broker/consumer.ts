import { Consumer, Kafka } from 'kafkajs';
import { ServiceBusClient } from '@azure/service-bus';
import { PubSub } from '@google-cloud/pubsub';
import { BrokerConsumerInterface, BrokerPublisherInterface, ListenerConfigurationInterface } from '../../interfaces';

type BrokerClientType = Kafka | ServiceBusClient | PubSub | null

/**
 * create consumer
 * @param {*} brokerClient
 * @param {*} brokerOptions
 * @returns {Consumer}
 */
const createConsumer = (brokerClient: BrokerClientType, brokerOptions: BrokerPublisherInterface): BrokerConsumerInterface => {
  /**
   * @callback messageReceived
   * @param {*} message
   */

  /**
   * @callback messageError
   * @param {*} message
   */

  /**
   * @typedef {Object} ListenerOption
   * @property {messageReceived} onMessage
   * @property {messageError} onError
   * @property {String} [topic]
   */

  let brokerReceiver: Consumer;
  const messageProcessor: { [key: string]: ListenerConfigurationInterface } = {};

  /**
   *
   * @param {Kafka} client
   * @param {BrokerOptionSubscriber} options
   */
  const createReceiverKafka = async (client: BrokerClientType, options: ListenerConfigurationInterface) => {
    /**
     * @type {import('kafkajs').Consumer}
     */
    const consumer = brokerReceiver || (client as Kafka).consumer({
      groupId: brokerOptions.kafkaOption.groupId,
    });

    if (!brokerReceiver) {
      await consumer.connect();
    }

    await consumer.subscribe({
      topic: options.topic,
    });

    messageProcessor[options.topic] = options;

    if (!brokerReceiver) {
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          (client as Kafka).logger().debug('Message received', {
            topic,
            partition,
            offset: message.offset,
            timestamp: message.timestamp,
            headers: Object.keys(message.headers || {}).reduce(
              (headers, key) => ({
                ...headers,
                [key]: message.headers[key].toString(),
              }),
              {},
            ),
            key: message.key.toString(),
            value: (message.value || '').toString(),
          });

          try {
            messageProcessor[topic].onMessage(message);
          } catch (err) {
            messageProcessor[topic].onError(message);
          }
        },
      });
    }
    brokerReceiver = consumer;
  };

  /**
   *
   * @param {PubSub} client
   * @param {ListenerOption} options
   */
  const createReceiverPubSub = (client: BrokerClientType, options: ListenerConfigurationInterface) => {
    const subscription = (client as PubSub).subscription(options.topic);
    subscription.addListener('message', options.onMessage);
    subscription.addListener('error', options.onError);
  };

  /**
   *
   * @param {ServiceBusClient} client
   * @param {ListenerOption} options
   */
  const createReceiverServiceBus = async (client: BrokerClientType, options: ListenerConfigurationInterface) => {
    const receiver = (client as ServiceBusClient).createReceiver(options.topic);
    receiver.subscribe({
      processMessage: options.onMessage,
      processError: options.onError,
    });
  };

  /**
   * create subscriber instance to create message
   * @param {BrokerOptionSubscriber} options
   */
  const addListener = async (options: ListenerConfigurationInterface) => {
    switch (brokerOptions.type) {
      case 'kafka':
        await createReceiverKafka(brokerClient, options);
        break;
      case 'pubsub':
        createReceiverPubSub(brokerClient, options);
        break;
      case 'servicebus':
        await createReceiverServiceBus(brokerClient, options);
        break;
      default:
        if (brokerClient) {
          throw new Error('Broker client not found');
        }
        break;
    }
  };

  return {
    addListener,
  };
};

/**
 * @typedef {Object} BrokerOptionSubscriber
 * @property {String} topic
 * @property {String} subscription
 * @property {*} onMessage
 * @property {*} onError
 */

/**
 * @callback AddListener
 * @param {BrokerOptionSubscriber} options
 * @returns {Promise<Void>}
 */

/**
 * @typedef {Object} Consumer
 * @property {AddListener} addListener
 */

export { createConsumer };
