import { ListenerConfigurationInterface } from './listenerConfigurationInterface';

export interface BrokerConsumerInterface {
  /**
   * Add Listener Function
   */
  addListener: (options: ListenerConfigurationInterface) => Promise<void>;
}
