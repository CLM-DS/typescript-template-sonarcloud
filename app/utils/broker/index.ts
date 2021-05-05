import { Kafka } from 'kafkajs';
import { PubSub }  from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createProducer } from './producer';
import { createConsumer } from './consumer';
import { brokerInterface, brokerPublisherInterface, listenerConfigurationInterface, listenerInterface, poolInterface } from '../../interfaces';
import { brokerClientType } from '../../types';

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
const createBroker = (brokerOptions: brokerPublisherInterface): brokerInterface => {
  /**
   * @type {(ServiceBusClient|Kafka|PubSub)}
   */
  let brokerClient: brokerClientType = null;

  /**
   * create client kafak
   * @param {KafkaOption} options
   */
  const createKafka = (options: brokerPublisherInterface['kafkaOption']) => new Kafka(options);

  const createPubSub = () => new PubSub();

  const createServiceBus = (strConn: brokerPublisherInterface['serviceBusStrCnn']) => new ServiceBusClient(strConn);
  /**
   * @type {boolean|String}
   */
  let err: string | boolean = false;

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

  initBroker();
  const brokerProducer = createProducer(brokerClient, brokerOptions);
  const brokerConsumer = createConsumer(brokerClient, brokerOptions);
  let producerKafka;
  
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
  return {
    check,
    producer: brokerProducer,
    consumer: brokerConsumer,
    setError,
    haveError,
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
const createPool = (): poolInterface => {
  const pool: Record<string, brokerInterface> = {};
  const aliases: Array<string> = [];
  const addBroker = (alias: string, broker: brokerInterface) => {
    pool[alias] = broker;
    aliases.push(alias);
  };/**
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
  const map = (func: (arg0: brokerInterface) => brokerInterface) => aliases.map((alias) => func(pool[alias]));

  let err = false;
  const setError = (error: boolean) => {
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

/**
 * Injects in each message the information of connection to database and configurations,
 * in the context key
 * @param {*} args object with, db, log and config from app
 * @param {*} onMessage handler to processing event received
 */
 const createContextMessage = (args: listenerInterface, onMessage: listenerConfigurationInterface['onMessage']) => (msg) => {
  const msgMutable = msg;
  msgMutable.context = args;
  
  return onMessage(msgMutable);
};

export { createBroker, createPool, createContextMessage };
