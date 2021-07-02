import Koa from 'koa';
import { Logger } from 'pino';
import { ConfigurationInterface } from './configurationInterface';

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
  log: Logger,
}
