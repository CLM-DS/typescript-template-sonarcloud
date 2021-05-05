import { listenerConfigurationInterface } from '.';

interface brokerConsumerInterface {
  /**
   * Add Listener Function
   */
  addListener: (options: listenerConfigurationInterface) => Promise<void>;
}

export { brokerConsumerInterface };
