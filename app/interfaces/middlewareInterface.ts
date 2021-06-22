import Koa from 'koa';
import { ConfigurationInterface } from './configurationInterface';
import { wrapperDB } from '../utils';
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
  db: typeof wrapperDB,
}
