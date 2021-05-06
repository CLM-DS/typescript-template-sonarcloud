import { ConfigurationInterface } from '.';
import { wrapperDB } from '../utils';
import Koa from 'koa';
import { createPool } from '../utils/broker';

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
  pool?: ReturnType<typeof createPool>,
  /**
   * Database Instance
   */
  db: typeof wrapperDB,
}
