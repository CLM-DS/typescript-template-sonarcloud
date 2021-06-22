import { BrokerConfigurationInterface } from './configurationInterface';
import { wrapperDB } from '../utils';
import { createLogger } from '../utils/logger';

export interface ListenerInterface {
  /**
   * MicroService Default Prefix
   */
  options: BrokerConfigurationInterface,
  /**
   * Listening Port Number
   */
  db?: typeof wrapperDB,
  /**
   * Mongo DataBase URI
   */
  log: ReturnType<typeof createLogger>,
}
