import { ConfigurationInterface, ListenerInterface } from '../interfaces';
import { createBroker, createPool } from '../utils/broker';

const createBrokers = (options: ConfigurationInterface) => {
  const pool = createPool();
  const entries = Object.entries(options.brokerConfig!);

  entries.forEach((entry) => {
    pool.addBroker(entry[0], createBroker(entry[1]));
  });

  return pool;
};
/**
 * Configure all middleware to application
 * @param {*} args
 * @returns {*}
 */
const useListeners = (args: ListenerInterface): ReturnType<typeof createPool> | undefined => {
  const { options } = args;

  if (
    options
    && options.brokerConfig
    && Object.keys(options.brokerConfig).length > 0
  ) {
    return createBrokers(options);
  }

  return undefined;
};

export { useListeners };
