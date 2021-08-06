import { KafkaConfig } from 'kafkajs';

interface KafkaOption extends KafkaConfig {
  topic: string,
  groupId: string
}

export interface BrokerConfig {
  [alias: string]: BrokerPublisherInterface
}

export interface BrokerPublisherInterface {
  /**
   * Option type
   */
  type: 'kafka' | 'pubsub' | 'servicebus',
  /**
   *  Kafka Option
   */
  kafkaOption?: KafkaOption,
  /**
   * Service Bus
   */
  serviceBusStrCnn?: string,
}
