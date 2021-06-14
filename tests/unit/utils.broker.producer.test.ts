
import kafkajs from 'kafkajs';
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
});