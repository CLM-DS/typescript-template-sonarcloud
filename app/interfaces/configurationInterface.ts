import { LoggerOptions } from 'pino';
import { BrokerConfig } from './brokerPublisherInterface';

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
}

export interface BrokerConfigurationInterface extends ConfigurationInterface {
  /**
   * Broker Configuration
   */
  brokerConfig?: BrokerConfig,
}
