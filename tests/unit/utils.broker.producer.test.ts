import kafkajs from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createPool, createBroker }  from '../../app/utils/broker';
const kafkaDependecyMocked = <jest.Mock<kafkajs.Kafka>>kafkajs.Kafka;
const pubsubDependencyMocked = <jest.Mock<PubSub>><unknown>PubSub;
const servicebusDependencyMocked = <jest.Mock<ServiceBusClient>>ServiceBusClient;
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
jest.mock('kafkajs');

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka, publish', async () => {
    const pool = createPool();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      send: jest.fn(() =>Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkaDependecyMocked.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    } as any));
    const brokerKafka = createBroker({ type: 'kafka', kafkaOption: {} as any });
    brokerKafka.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerKafka);
    const record = await pool.getBroker('kafka').producer.publish('', {} as any);
    expect(pool).toBeDefined();
    expect(record).not.toBeDefined();
  });

  it('Test Case Create Broker PubSub, publish', async () => {
    const pool = createPool();
    pubsubDependencyMocked.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    } as any));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    brokerPubSub.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerPubSub);
    
    const messageId = await brokerPubSub.producer.publish('', { data: {} } as any);
    expect(messageId).toEqual('id');
  });

  it('Test Case Create Broker PubSub, publish', async () => {
    const pool = createPool();
    servicebusDependencyMocked.mockImplementationOnce(() => ({
      createSender: jest.fn(() => ({
        sendMessages: jest.fn(() => 'id'),
      })),
    } as any));
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    brokerServiceBus.setError('err');
    pool.setError('err');
    pool.addBroker('kafka', brokerServiceBus);
    
    const idQueue = await brokerServiceBus.producer.publish('', { data: {} } as any);
    expect(pool).toBeDefined();
    expect(idQueue).toEqual('id');
  });
});