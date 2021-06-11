import { KafkaMessage } from 'kafkajs';
import { ListenerInterface, PoolInterface } from '../interfaces';

/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const createListener = async (pool: PoolInterface, args: ListenerInterface): Promise<void> => {
  const broker = (pool as PoolInterface).getBroker('kafka');

  // this is code from example
  const listenerConfig = {
    topic: 'topic-dummy',
    onMessage: (message: KafkaMessage) => {
      args.log.info(message);
    },
    onError:  (err: Error) => {
      args.log.error(err);
    },
  };
  
  // example from broker listener event
  await broker?.consumer.addListener(listenerConfig);
};

export { createListener };
