import { BrokerConsumerInterface } from './brokerConsumerInterface';
import { BrokerProducerInterface } from './brokerProducerInterface';

export interface BrokerInterface {
  /**
   * Check function
   */
  check: () => Promise<boolean>,
  /**
   * Producer
   */
  producer: BrokerProducerInterface,
  /**
   * Consumer
   */
  consumer: BrokerConsumerInterface,
  /**
   * Set Error Function
   */
  setError: (error: string | boolean) => void,
  /**
   * Have Error Function
   */
  haveError: () => string | boolean,
}
