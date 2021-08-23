import { ServiceBusClient } from '@azure/service-bus';
import { PubSub } from '@google-cloud/pubsub';
import {
  Kafka, Message, Producer, ProducerRecord,
} from 'kafkajs';
import xss from 'xss';
import { BrokerTypeInterface } from '../../interfaces/brokerConfigInterface';
import {
  ArgsBroker, BrokerClientType, BrokerProducerInterface,
  MessageBroker, MessageBrokerValue, TopicBroker,
} from '../../interfaces/brokerProducerInterface';

/**
 * create producer from event
 * @param {*} brokerClient
 * @param {*} brokerOptions
 * @returns {Producer}
 */
const createProducer = (
  brokerClient: BrokerClientType, brokerOptions: BrokerTypeInterface,
): BrokerProducerInterface => {
  const defaultRecord = {
    topic: '',
    data: undefined,
    attrs: undefined,
  };
  let brokerProducer: Producer;

  /**
   *
   * @param {Kafka} client
   * @param {import('kafkajs').ProducerRecord} record
   */
  const publishMessageKafka = async (client: Kafka, record: ProducerRecord) => {
    /**
     * @type {import('kafkajs').Producer}
     */
    const producer = brokerProducer || client.producer();

    const produce = async () => {
      if (!brokerProducer) {
        await producer.connect();
      }

      return producer.send(record);
    };

    // Check for errors during execution and restart or exit
    produce().catch(async (error) => {
      client.logger().error('Kafka producer error', error);

      try {
        await producer.disconnect();
        // process.exit(0);
      } catch (er) {
        client.logger().error('Failed to gracefully disconnect Kafka producer', er);
        // process.exit(1);
      }

      if (brokerOptions.onCrash) {
        brokerOptions.onCrash(error);
      }
    });

    brokerProducer = producer;
  };

  /**
   *
   * @param {PubSub} client
   */
  const publishMessagePubSub = (
    client: PubSub, record: ArgsBroker & MessageBrokerValue & TopicBroker = defaultRecord,
  ) => {
    /**
     * @type {import("@google-cloud/pubsub").Topic}
     */
    const topicInstance = client.topic(record.topic);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let dataStr: string | undefined = record.data;

    if (typeof dataStr !== 'string') {
      dataStr = JSON.stringify(dataStr);
    }

    return topicInstance.publish(Buffer.from(dataStr, 'utf-8'), record.attrs);
  };

  /**
   *
   * @param {import('@azure/service-bus').ServiceBusClient} client
   */

  const publishMessageServiceBus = (
    client: ServiceBusClient, record: ArgsBroker & MessageBrokerValue & TopicBroker = defaultRecord,
  ) => {
    /**
     * @type {import("@azure/service-bus").ServiceBusSender}
     */
    const queueInstance = client.createSender(record.topic);
    return queueInstance.sendMessages({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: JSON.parse(xss(JSON.stringify(record.data))),
    });
  };

  const publishMessage = (
    topic: string,
    message: MessageBroker,
    args: ArgsBroker = defaultRecord,
  ) => {
    switch (brokerOptions.type) {
      case 'kafka':
        return publishMessageKafka(brokerClient as Kafka, {
          topic,
          messages: [message as Message],
          acks: args.acks,
          compression: args.compression,
        });
      case 'pubsub':
        return publishMessagePubSub(brokerClient as PubSub, {
          ...args,
          ...message as MessageBrokerValue,
          topic,
        });
      case 'servicebus':
        return publishMessageServiceBus(brokerClient as ServiceBusClient, {
          ...args,
          ...message as MessageBrokerValue,
          topic,
        });
      default:
        if (brokerClient) {
          throw new Error('Broker client not found');
        }
        throw new Error('type invalid');
    }
  };
  return {
    publish: publishMessage,
  };
};

/**
 * @callback Publish
 * @param {String} topic
 * @param {*} message
 * @param {*} [args]
 * @returns {Promise<(String|import('kafkajs').RecordMetadata[]|void)>}
 */

/**
 * @typedef {Object} Producer
 * @property {Publish} publish
 */
export { createProducer };
