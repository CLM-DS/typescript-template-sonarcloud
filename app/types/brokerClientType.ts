import { ServiceBusClient } from '@azure/service-bus';
import { PubSub } from '@google-cloud/pubsub';
import { Kafka } from 'kafkajs';

type brokerClientType = Kafka | ServiceBusClient | PubSub | null;

export { brokerClientType };