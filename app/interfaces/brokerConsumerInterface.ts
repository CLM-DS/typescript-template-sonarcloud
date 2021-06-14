import { ListenerConfigurationInterface } from '.';

export interface BrokerConsumerInterface {
  /**
   * Add Listener Function
   */
  addListener: (options: ListenerConfigurationInterface) => Promise<void>;
}
