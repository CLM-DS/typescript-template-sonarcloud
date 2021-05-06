import { BrokerPublisherInterface } from '.';

export interface ConfigurationInterface {
  /**
   * MicroService Default Prefix
   */
  prefix: string,
  /**
   * Listening Port Number
   */
  port: number,
  /**
   * Mongo DataBase URI
   */
  mongoUri: string,
  /**
   * Database Name
   */
  dataSource: string,
}

export interface BrokerConfigurationInterface extends ConfigurationInterface {
  /**
   * Broker Configuration
   */
  brokerConfig: BrokerPublisherInterface,
}
