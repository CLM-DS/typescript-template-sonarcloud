import { RecordMetadata } from 'kafkajs';

interface brokerProducerInterface {
  /**
   * Add Publish Function
   */
  publish: (topic: string, message, args) => Promise<string> | Promise<Array<RecordMetadata>> | Promise<void>;
}

export { brokerProducerInterface };
