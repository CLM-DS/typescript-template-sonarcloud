import { ServiceBusClient } from '@azure/service-bus';
import { PubSub } from '@google-cloud/pubsub';
import { Kafka } from 'kafkajs';

export type BrokerClientType = Kafka | ServiceBusClient | PubSub | null;