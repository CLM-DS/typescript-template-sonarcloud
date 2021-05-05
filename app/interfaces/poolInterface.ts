import { brokerInterface } from '.';

interface poolInterface {
  /**
   * Add Broker Function
   */
  addBroker: (alias: string, broker: brokerInterface) => void,
  /**
   * Get Broker Function
   */
  getBroker: (alias: string) => brokerInterface,
  /**
   * Consumer
   */
  map: (func: (arg0: brokerInterface) => brokerInterface) => Array<brokerInterface>,
  /**
   * Set Error Function
   */
  setError: (error: boolean) => void,
  /**
   * Have Error Function
   */
  haveError: () => string | boolean,
}

export { poolInterface };