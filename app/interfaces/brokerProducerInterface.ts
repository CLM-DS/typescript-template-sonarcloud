import { RecordMetadata } from 'kafkajs';

export interface BrokerProducerInterface {
  /**
   * Add Publish Function
   */
  publish: (topic: string, message, args) => Promise<string> | Promise<Array<RecordMetadata>> | Promise<void>;
}
