jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
jest.mock('kafkajs');

import kafkajs from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createPool, createBroker } from '../../app/utils/broker';

const kafkaDependecyMocked = <jest.Mock<kafkajs.Kafka>>kafkajs.Kafka;
const pubsubDependencyMocked = <jest.Mock<PubSub>><unknown>PubSub;
const servicebusDependencyMocked = <jest.Mock<ServiceBusClient>>ServiceBusClient;

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka, publish', async () => {
    const pool = createPool();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      send: jest.fn(() => Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkaDependecyMocked.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    } as never));
    const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] } });
    brokerKafka.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerKafka);
    const record = await pool.getBroker('kafka').producer.publish('', { data: {} }, {});
    expect(pool).toBeDefined();
    expect(record).not.toBeDefined();
  });

  it('Test Case Create Broker PubSub, publish', async () => {
    const pool = createPool();
    pubsubDependencyMocked.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    } as never));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    brokerPubSub.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerPubSub);

    const messageId = await brokerPubSub.producer.publish('', { data: {} }, {});
    expect(messageId).toEqual('id');
  });

  it('Test Case Create Broker ServiceBus, publish', async () => {
    const pool = createPool();
    servicebusDependencyMocked.mockImplementationOnce(() => ({
      createSender: jest.fn(() => ({
        sendMessages: jest.fn(() => 'id'),
      })),
    } as never));
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    brokerServiceBus.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerServiceBus);

    const idQueue = await brokerServiceBus.producer.publish('', { data: {} }, {});
    expect(pool).toBeDefined();
    expect(idQueue).toEqual('id');
  });
});
