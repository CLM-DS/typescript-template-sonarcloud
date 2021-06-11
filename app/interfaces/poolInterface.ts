import { BrokerInterface } from '.';

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
  map: (func: (arg0: BrokerInterface) => BrokerInterface) => Array<BrokerInterface>,
  /**
   * Set Error Function
   */
  setError: (error: boolean | string) => void,
  /**
   * Have Error Function
   */
  haveError: () => string | boolean,
}
