import { WrapperDBInterface } from 'app/utils/wrapperDB';
import { Logger } from 'pino';
import { BrokerConfigurationInterface } from './configurationInterface';

export interface ListenerInterface {
  /**
   * MicroService Default Prefix
   */
  options: BrokerConfigurationInterface,
  /**
   * Listening Port Number
   */
  db?: WrapperDBInterface,
  /**
   * Mongo DataBase URI
   */
  log: Logger,
}
