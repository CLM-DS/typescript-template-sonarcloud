import { LoggerOptions } from 'pino';
import { BrokerConfigInterface } from './brokerConfigInterface';

export interface ConfigurationInterface {
  /**
   * MicroService Default Prefix
   */
  prefix?: string,
  /**
   * Listening Port Number
   */
  port?: number,
  /**
   * Mongo DataBase URI
   */
  mongoUri?: string,
  /**
   * Database Name
   */
  dataSource?: string,
  /**
   * LoggerOptions
   */
  log?: LoggerOptions;
  /**
   * Broker Configuration
   */
  brokerConfig?: BrokerConfigInterface,

  password?: string,

  user?: string,

  database?: string
}
