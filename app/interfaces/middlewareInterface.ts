import { configurationInterface } from '.';
import { wrapperDB } from '../utils';
import Koa from 'koa';
import { createPool } from '../utils/broker';

interface middlewareInterface {
  /**
   * Configuration Interface
   */
  options: configurationInterface,
  /**
   * Koa Instance
   */
  app: Koa,
  /**
   * Pool Instance
   */
  pool: ReturnType<typeof createPool> | undefined,
  /**
   * Database Instance
   */
  db: typeof wrapperDB,
}

export { middlewareInterface };