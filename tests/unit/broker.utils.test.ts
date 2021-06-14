import kafkajs, { ConsumerRunConfig } from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createPool, createBroker }  from '../../app/utils/broker';
import { messageMock } from '../mocks/mockMessage';
const kafkaDependecyMocked = <jest.Mock<kafkajs.Kafka>>kafkajs.Kafka;
const pubsubDependencyMocked = <jest.Mock<PubSub>>PubSub;
const servicebusDependencyMocked = <jest.Mock<ServiceBusClient>>ServiceBusClient;
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
jest.mock('kafkajs');

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka', () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const broker = createBroker({ type: 'kafka', kafkaOption: {} as any });
    expect(broker.haveError()).toEqual(false);
    const brokerPubSub = createBroker({ type: 'pubsub' });
    expect(brokerPubSub.haveError()).toEqual(false);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    expect(brokerServiceBus.haveError()).toEqual(false);
    const brokerFail = createBroker({ type: null as any });
    expect(brokerFail.haveError()).toBeDefined();
  });
  it('Test Case Create Broker Kafka, check', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkaDependecyMocked.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    } as any));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} as any });
    const isCheckKafka = await broker.check();
    expect(isCheckKafka).toEqual(true);
    pubsubDependencyMocked.mockImplementationOnce(() => ({
      auth: {
        getAccessToken: jest.fn(() => Promise.resolve()),
      },
    } as any));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const isCheckPubSub = await brokerPubSub.check();
    expect(isCheckPubSub).toEqual(true);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    const isCheckServiceBus = await brokerServiceBus.check();
    expect(isCheckServiceBus).toEqual(true);
  });
  it('Test Case Create Broker Kafka, check fail', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const broker = createBroker({ type: 'dummy' as any, kafkaOption: {} as any });
    expect(() => pool.getBroker('kafka')).toThrow();
    expect(broker.check()).rejects.toThrowError('Broker client not found');
  });
  it('Test Case Create Broker Kafka, publish', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    pool.setError('err');
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      send: jest.fn(() => {}),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkaDependecyMocked.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    } as any));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} as any });
    broker.setError('err');
    pool.addBroker('kafka', broker);
    const record = await pool.getBroker('kafka').producer.publish('', {} as any);
    expect(record).not.toBeDefined();
    pubsubDependencyMocked.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    } as any));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const messageId = await brokerPubSub.producer.publish('', { data: {} } as any);
    expect(messageId).toEqual('id');
    servicebusDependencyMocked.mockImplementationOnce(() => ({
      createSender: jest.fn(() => ({
        sendMessages: jest.fn(() => 'id'),
      })),
    } as any));
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    const idQueue = await brokerServiceBus.producer.publish('', { data: {} } as any);
    expect(idQueue).toEqual('id');
  });
  it('Test Case Create Broker Kafka, consumer', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const consumerKafkaMock = jest.fn();
    const consumerObj = {
      connect: jest.fn(() => Promise.resolve()),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      subscribe: jest.fn(() => {}),
      run: jest.fn(() => Promise.resolve()),
      on: jest.fn(() => Promise.resolve()),
      events: { CRASH: 'consumer.crash' },
    };
    consumerKafkaMock.mockReturnValueOnce(consumerObj);
    kafkaDependecyMocked.mockImplementationOnce(() => ({
      consumer: consumerKafkaMock,
    } as any));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} as any });
    const spy = jest.spyOn(consumerObj, 'connect');
    await broker.consumer.addListener({
      topic: '',
      onMessage: {},
      onError: {},
    } as any);
    expect(spy).toHaveBeenCalled();
    const objectSusbscription = {
      addListener: jest.fn(() => 'id'),
    };
    pubsubDependencyMocked.mockImplementationOnce(() => ({
      subscription: jest.fn(() => objectSusbscription),
    } as any));
    const spyPub = jest.spyOn(objectSusbscription, 'addListener');
    const brokerPubSub = createBroker({ type: 'pubsub' });
    await brokerPubSub.consumer.addListener({
      topic: '',
      onMessage: () => undefined,
      onError: {},
    } as any);
    expect(spyPub).toHaveBeenCalled();

    const objectSubscribe = {
      subscribe: jest.fn(() => 'id'),
    };
    servicebusDependencyMocked.mockImplementationOnce(() => ({
      createReceiver: jest.fn(() => objectSubscribe),
    } as any));
    const spySer = jest.spyOn(objectSubscribe, 'subscribe');
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: '',
    });
    await brokerServiceBus.consumer.addListener({
      topic: '',
      onMessage: {},
      onError: {},
    } as any);
    expect(spySer).toHaveBeenCalled();
  });
  
  it('Test Case Broker Kafka consumer each message ', async () => {
    const consumerKafkaMock = jest.fn();
    const consumerObj = {
      connect: jest.fn(() => Promise.resolve()),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      subscribe: jest.fn(() => {}),
      run: jest.fn(),
      on: jest.fn(() => Promise.resolve()),
      events: { CRASH: 'consumer.crash' },
    };
    consumerKafkaMock.mockReturnValueOnce(consumerObj);
    let argsConsumer: ConsumerRunConfig = {} as unknown as ConsumerRunConfig;
    consumerObj.run.mockImplementation((args: ConsumerRunConfig) => { 
      argsConsumer = args
    });

    kafkaDependecyMocked.mockImplementationOnce(() => ({
      consumer: consumerKafkaMock,
    } as any));
    const broker = createBroker({ type: 'kafka', kafkaOption: {} as any });
    const spy = jest.spyOn(consumerObj, 'connect');
    await broker.consumer.addListener({
      topic: '',
      onMessage: {},
      onError: {},
    } as any);
    expect(spy).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    argsConsumer.eachMessage!(messageMock)
    
  });
});
