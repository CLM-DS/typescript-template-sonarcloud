import { ListenerInterface, PoolInterface } from '../interfaces';
import { createContextMessage } from '../utils/broker';

/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const createListener = async (pool: PoolInterface, args: ListenerInterface): Promise<void> => {
  const broker = (pool as PoolInterface).getBroker('kafka');

  // this is code from example
  const listenerConfig = {
    topic: 'topic-dummy',
    onMessage: createContextMessage(args, (message) => {
      args.log.info(message);
    }),
    onError: createContextMessage(args, (err) => {
      args.log.error(err);
    }),
  };
  
  // example from broker listener event
  await broker?.consumer.addListener(listenerConfig);
};

export { createListener };
