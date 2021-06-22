import Koa from 'koa';
import { ConfigurationInterface } from './configurationInterface';
import { createLogger } from '../utils/logger';

export interface RouteInterface {
  /**
   * MicroService Default Prefix
   */
  options: ConfigurationInterface,
  /**
   * Koa Instance
   */
  app: Koa,
  /**
   * Mongo DataBase URI
   */
  log: ReturnType<typeof createLogger>,
}
