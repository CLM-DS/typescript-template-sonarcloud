
import kafkajs from 'kafkajs';
// import pubsub from '@google-cloud/pubsub';
// import servicebus from '@azure/service-bus';
import { createPool, createBroker } from '../../app/utils/broker';

jest.mock('kafkajs');
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka, producer success', async () => {
    const kafkaMock = kafkajs as jest.Mocked<typeof kafkajs>;
    kafkaMock.Kafka.mockReturnValueOnce({
      producer: jest.fn().mockReturnValueOnce({
        connect: jest.fn(() => Promise.resolve()),
        disconnect: jest.fn(() => Promise.resolve()),
        send: jest.fn(() => 'response'),
      }),
      consumer: jest.fn(), 
      admin: jest.fn(), 
      logger: jest.fn()
    });
    const pool = createPool();
    const brokerKafka = createBroker({ type: 'kafka', kafkaOption: { groupId: '123', brokers: ['broker'] }});
    pool.addBroker('kafka', brokerKafka);
    const record = await pool.getBroker('kafka').producer.publish('topic', { value: 'test' },  {});
    expect(pool).toBeDefined();
    expect(record).toEqual('response');
  });

  /*it('Test Case Create Broker PubSub, producer', async () => { 
    pubsub.PubSub.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    }));
    const brokerPubSub = createBroker({ type: 'pubsub' });
    const messageId = await brokerPubSub.producer.publish('', { data: {} });
    expect(messageId).toEqual('id');
  });*/

  /*it('Test Case Create Broker Servicebus, producer', async () => {
    const servicebusMock = servicebus as jest.Mocked<typeof servicebus>;
    servicebusMock.ServiceBusClient.mockReturnValueOnce({
      createSender: jest.fn().mockReturnValueOnce({
        sendMessages: jest.fn(() => Promise.resolve()),
        createMessageBatch: jest.fn(),
        isClosed: false,
        scheduleMessages: jest.fn(),
        cancelScheduledMessages: jest.fn(),
        entityPath: '',
        close: jest.fn()
      }),
      fullyQualifiedNamespace: '',
      createReceiver: jest.fn(),
      acceptSession: jest.fn(),
      acceptNextSession: jest.fn(),
      close: jest.fn(),
    });
    const pool = createPool();    
    const brokerServiceBus = createBroker({ type: 'servicebus', serviceBusStrCnn: '' });
    pool.addBroker('servicebus', brokerServiceBus);
    const record = await brokerServiceBus.producer.publish('topic', { value: 'test' }, {});
    expect(pool).toBeDefined();
    expect(record).toEqual('response');
  });*/
});