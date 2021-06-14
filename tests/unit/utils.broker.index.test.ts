import kafkajs from 'kafkajs';
import { createPool, createBroker } from '../../app/utils/broker';

jest.mock('kafkajs');
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Success', () => {
    const pool = createPool();
    const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] }});
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const brokerServiceBus = createBroker({ type: 'servicebus', serviceBusStrCnn: '' });

    expect(pool).toBeDefined();
    expect(brokerKafka.haveError()).toEqual(false);
    expect(brokerPubSub.haveError()).toEqual(false);
    expect(brokerServiceBus.haveError()).toEqual(false);
  });

  it('Test Case Create Broker Failure', () => {
    const brokerFail = createBroker({ type: 'kafka' });
    expect(brokerFail.haveError()).toBeDefined();
  });

  it('Test Case Create Broker Kafka check success', async () => {
    const kafkaMock = kafkajs as jest.Mocked<typeof kafkajs>;
    kafkaMock.Kafka.mockReturnValueOnce({
      producer: jest.fn().mockReturnValueOnce({
        connect: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve())
      }),
      consumer: jest.fn(), 
      admin: jest.fn(), 
      logger: jest.fn()
    });
    const pool = createPool();
    const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] }});
    pool.addBroker('kafka', brokerKafka);
    expect(pool).toBeDefined();
    expect(() => { pool.getBroker('kafka'); }).not.toThrow();
    expect(await brokerKafka.check()).toEqual(true);
  });

  it('Test Case Create Broker ServiceBus check success', async () => {
    const pool = createPool();
    const brokerServiceBus = createBroker({ type: 'servicebus', serviceBusStrCnn: '' });
    pool.addBroker('servicebus', brokerServiceBus);
    expect(pool).toBeDefined();
    expect(() => { pool.getBroker('servicebus'); }).not.toThrow();
    expect(await brokerServiceBus.check()).toEqual(true);
  });

  it('Test Case Create Broker check failure', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    expect(() => { pool.getBroker('kafka'); }).toThrow();
  });
});
