import { configurationInterface } from '.';
import { wrapperDB } from '../utils';
import { createLogger } from '../utils/logger';

interface listenerInterface {
  /**
   * MicroService Default Prefix
   */
  options: configurationInterface,
  /**
   * Listening Port Number
   */
  db: typeof wrapperDB,
  /**
   * Mongo DataBase URI
   */
  log: ReturnType<typeof createLogger>,
}

export { listenerInterface };