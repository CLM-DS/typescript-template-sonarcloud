import { KafkaConfig } from 'kafkajs';

interface KafkaOption extends KafkaConfig {
  topic: string,
  groupId: string
}

export interface BrokerTypeInterface {
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
  /**
   * Callback value for critical errors
   */
  onCrash?: (error: string) => void,
}

export interface BrokerConfigInterface {
  [alias: string]: BrokerTypeInterface
}
