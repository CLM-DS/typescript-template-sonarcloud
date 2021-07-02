import Koa from 'koa';
import { WrapperDBInterface } from 'app/utils/wrapperDB';
import { ConfigurationInterface } from './configurationInterface';
import { PoolInterface } from './poolInterface';

export interface MiddlewareInterface {
  /**
   * Configuration Interface
   */
  options: ConfigurationInterface,
  /**
   * Koa Instance
   */
  app: Koa,
  /**
   * Pool Instance
   */
  pool?: PoolInterface,
  /**
   * Database Instance
   */
  db: WrapperDBInterface,
}
