import kafkajs, { ConsumerRunConfig } from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createPool, createBroker } from '../../app/utils/broker';
import { messageMock } from '../mocks/mockMessage';

const kafkaDependecyMocked = <jest.Mock<kafkajs.Kafka>>kafkajs.Kafka;
const pubsubDependencyMocked = <jest.Mock<PubSub>><unknown>PubSub;
const servicebusDependencyMocked = <jest.Mock<ServiceBusClient>>ServiceBusClient;
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
jest.mock('kafkajs');

it('Test Case Create Broker Kafka, consumer', async () => {
  const pool = createPool();
  const consumerKafkaMock = jest.fn();
  const consumerObj = {
    connect: jest.fn(() => Promise.resolve()),
    subscribe: jest.fn(() => Promise.resolve()),
    run: jest.fn(() => Promise.resolve()),
    on: jest.fn(() => Promise.resolve()),
    events: { CRASH: 'consumer.crash' },
  };
  consumerKafkaMock.mockReturnValueOnce(consumerObj);
  kafkaDependecyMocked.mockImplementationOnce(() => ({
    consumer: consumerKafkaMock,
    logger: jest.fn().mockReturnValueOnce({
      debug: jest.fn(),
    }),
  } as never));
  const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] } });
  const spy = jest.spyOn(consumerObj, 'connect');
  await brokerKafka.consumer.addListener({
    topic: 'test',
    onMessage: () => ({}),
    onError: () => ({}),
  });
  expect(pool).toBeDefined();
  expect(spy).toHaveBeenCalled();
});

it('Test Case Create Broker PubSub, consumer', async () => {
  const pool = createPool();
  const objectSusbscription = {
    addListener: jest.fn(() => 'id'),
  };
  pubsubDependencyMocked.mockImplementationOnce(() => ({
    subscription: jest.fn(() => objectSusbscription),
  } as never));
  const spyPub = jest.spyOn(objectSusbscription, 'addListener');
  const brokerPubSub = createBroker({ type: 'pubsub' });
  await brokerPubSub.consumer.addListener({
    topic: 'test',
    onMessage: () => undefined,
    onError: () => ({}),
  });
  expect(pool).toBeDefined();
  expect(spyPub).toHaveBeenCalled();
});

it('Test Case Create Broker ServiceBus, consumer', async () => {
  const pool = createPool();
  const objectSubscribe = {
    subscribe: jest.fn(() => 'id'),
  };
  servicebusDependencyMocked.mockImplementationOnce(() => ({
    createReceiver: jest.fn(() => objectSubscribe),
  } as never));
  const spySer = jest.spyOn(objectSubscribe, 'subscribe');
  const brokerServiceBus = createBroker({
    type: 'servicebus',
    serviceBusStrCnn: '',
  });
  await brokerServiceBus.consumer.addListener({
    topic: 'test',
    onMessage: () => ({}),
    onError: () => ({}),
  });
  expect(pool).toBeDefined();
  expect(spySer).toHaveBeenCalled();
});

it('Test Case Broker Kafka consumer each message', async () => {
  const consumerKafkaMock = jest.fn();
  let argsConsumer: ConsumerRunConfig = {} as unknown as ConsumerRunConfig;
  const consumerObj = {
    connect: jest.fn(() => Promise.resolve()),
    subscribe: jest.fn(() => Promise.resolve()),
    run: jest.fn().mockImplementationOnce((args: ConsumerRunConfig) => {
      argsConsumer = args;
    }),
    on: jest.fn(() => Promise.resolve()),
    events: { CRASH: 'consumer.crash' },
  };
  consumerKafkaMock.mockReturnValueOnce(consumerObj);
  kafkaDependecyMocked.mockImplementationOnce(() => ({
    consumer: consumerKafkaMock,
    logger: jest.fn().mockReturnValueOnce({
      debug: jest.fn(),
    }),
  } as never));
  const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] } });
  const spy = jest.spyOn(consumerObj, 'connect');
  await brokerKafka.consumer.addListener({
    topic: 'test',
    onMessage: () => ({}),
    onError: () => ({}),
  });
  void argsConsumer.eachMessage?.(messageMock);

  expect(spy).toHaveBeenCalled();
});
