import { ListenerInterface } from '../interfaces';
import { createPool } from '../utils/broker';

/**
 *
 * @param {import('../utils/broker').PoolBroker} pool
 */
const createListener = async (pool: ReturnType<typeof createPool>, args: ListenerInterface): Promise<void> => {
  const broker = pool.getBroker('kafka');

  // this is code from example
  const listenerConfig = {
    topic: 'topic-dummy',
    onMessage: ((args, message) => {
      args.log.info(message);
    }).bind,
    onError: ((args, err) => {
      args.log.error(err);
    }).bind,
  };
  
  // example from broker listener event
  await broker.consumer.addListener(listenerConfig);
};

export { createListener };
