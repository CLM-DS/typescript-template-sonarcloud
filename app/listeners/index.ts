import { createBroker, createPool } from '../utils/broker';
import { BrokerConfigInterface, ListenerInterface, PoolInterface } from '../interfaces';

const createBrokers = (brokers: BrokerConfigInterface) => {
  const pool = createPool();
  const entries = Object.entries(brokers);

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
const useListeners = (args: ListenerInterface): PoolInterface | undefined => {
  const { options } = args;

  if (
    options
    && options.brokerConfig
    && Object.keys(options.brokerConfig).length > 0
  ) {
    return createBrokers(options.brokerConfig);
  }

  return undefined;
};

export { useListeners };
