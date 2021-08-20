import { BrokerInterface } from './brokerInterface';

export interface PoolInterface {
  /**
   * Add Broker Function
   */
  addBroker: (alias: string, broker: BrokerInterface) => void,
  /**
   * Get Broker Function
   */
  getBroker: (alias: string) => BrokerInterface,
  /**
   * Consumer
   */
  map: (func: (arg0: BrokerInterface) => BrokerInterface) => BrokerInterface[],
  /**
   * Set Error Function
   */
  setError: (error: boolean | string) => void,
  /**
   * Have Error Function
   */
  haveError: () => string | boolean,
}
