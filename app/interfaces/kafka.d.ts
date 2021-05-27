import { KafkaConfig } from 'kafkajs';

interface KafkaConfigConsumer extends KafkaConfig {
  groupId?: string
}

