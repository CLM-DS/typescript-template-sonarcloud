import Koa from 'koa';
import { configurationInterface } from '.';
import { createLogger } from '../utils/logger';

interface routeInterface {
  /**
   * MicroService Default Prefix
   */
  options: configurationInterface,
  /**
   * Koa Instance
   */
   app: Koa,
  /**
   * Mongo DataBase URI
   */
  log: ReturnType<typeof createLogger>,
}

export { routeInterface };