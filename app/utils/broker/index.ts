import { Kafka, KafkaConfig } from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createProducer } from './producer';
import { createConsumer } from './consumer';
import { BrokerInterface, BrokerTypeInterface, PoolInterface } from '../../interfaces';

type BrokerClientType = Kafka | ServiceBusClient | PubSub | null;

/**
 * @typedef {Object} KafkaOption
 * @property {import('kafkajs').KafkaConfig} config
 * @property {string} groupId
 */

/**
 * @typedef {Object} BrokerPublisherOption
 * @property {('kafka'|'pubsub'|'servicebus')} type
 * @property {KafkaOption} [kafkaOption]
 * @property {String} [serviceBusStrCnn]
 */

/**
 * @param {BrokerPublisherOption} brokerOptions
 */
const createBroker = (brokerOptions: BrokerTypeInterface): BrokerInterface => {
  /**
   * @type {(ServiceBusClient|Kafka|PubSub)}
   */
  let brokerClient: BrokerClientType = null;

  /**
   * create client Kafka
   * @param {KafkaOption} options
   */
  const createKafka = (options: BrokerTypeInterface['kafkaOption']) => new Kafka(options as KafkaConfig);

  const createPubSub = () => new PubSub();

  const createServiceBus = (strConn: BrokerTypeInterface['serviceBusStrCnn']) => new ServiceBusClient(strConn as string);
  /**
   * @type {boolean|String}
   */
  let err: string | boolean = false;
  let producerKafka;

  /**
   * create publisher instance to create message
   * @param {BrokerPublisherOption} options
   * @returns {(import('kafkajs').Producer)}
   */
  const initBroker = () => {
    switch (brokerOptions.type) {
      case 'kafka':
        brokerClient = createKafka(brokerOptions.kafkaOption);
        break;
      case 'servicebus':
        brokerClient = createServiceBus(brokerOptions.serviceBusStrCnn);
        break;
      case 'pubsub':
        brokerClient = createPubSub();
        break;
      default:
        brokerClient = null;
        err = 'Broker Type not Defined';
        break;
    }
  };

  const check = async () => {
    if (!brokerClient) {
      throw new Error('Broker client not found');
    }

    switch (brokerOptions.type) {
      case 'kafka':
        producerKafka = (brokerClient as Kafka).producer();
        await producerKafka.connect();
        await producerKafka.disconnect();
        return true;
      case 'pubsub':
        await (brokerClient as PubSub).auth.getAccessToken();
        return true;
      case 'servicebus':
        return true;
      default:
        throw new Error('type invalid');
    }
  };

  const setError = (error: string | boolean) => {
    err = error;
  };

  const haveError = () => err;

  initBroker();

  // set critical error callback
  const options = { ...brokerOptions };
  options.onCrash = (error) => setError(error);

  const brokerProducer = createProducer(brokerClient, options);
  const brokerConsumer = createConsumer(brokerClient, options);

  return {
    check,
    setError,
    haveError,
    producer: brokerProducer,
    consumer: brokerConsumer,
  };
};

/**
 * @typedef {Object} Broker
 * @property {*} check
 * @property {import('./producer').Producer} producer
 * @property {import('./consumer').Consumer} consumer
 * @property {*} setError
 * @property {*} haveError
 */

/**
 * @callback GetBroker
 * @param {String} alias
 * @returns {Broker}
 */

/**
 * @typedef {Object} PoolBroker
 * @property {} addBroker
 * @property {GetBroker} getBroker
 * @property {*} map
 */

/**
 * @returns {PoolBroker}
 */
const createPool = (): PoolInterface => {
  const pool: Record<string, BrokerInterface> = {};
  const aliases: Array<string> = [];
  let err: boolean | string = false;

  const addBroker = (alias: string, broker: BrokerInterface) => {
    pool[alias] = broker;
    aliases.push(alias);
  };

  /**
   * get broker instance by alias
   * @param {String} alias
   * @returns {Broker}
   */
  const getBroker = (alias: string) => {
    const broker = pool[alias];
    if (!broker) {
      throw new Error('broker not found');
    }
    return broker;
  };

  const map = (func: (arg0: BrokerInterface) => BrokerInterface) => aliases.map(
    (alias) => func(pool[alias]),
  );

  const setError = (error: boolean | string) => {
    err = error;
  };

  const haveError = () => err;

  return {
    addBroker,
    getBroker,
    map,
    setError,
    haveError,
  };
};

export { createBroker, createPool };
