import { WrapperDBInterface } from 'app/utils/wrapperDB';
import { Logger } from 'pino';
import { ConfigurationInterface } from './configurationInterface';

export interface ListenerInterface {
  /**
   * MicroService Default Prefix
   */
  options: ConfigurationInterface,
  /**
   * Listening Port Number
   */
  db?: WrapperDBInterface,
  /**
   * Mongo DataBase URI
   */
  log: Logger,
}
