import { KafkaConfig } from 'kafkajs';

interface kafkaOption extends KafkaConfig {
  groupId: string
}

interface brokerPublisherInterface {
  /**
   * Option type
   */
  type: 'kafka'|'pubsub'|'servicebus',
  /**
   *  Kafka Option
   */
   kafkaOption: kafkaOption,
  /**
   * Service Bus
   */
  serviceBusStrCnn: string,
}

export { brokerPublisherInterface };