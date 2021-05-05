interface configurationInterface {
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
  /**
   * Broker Configuration
   */
  brokerConfig?: any,
}

export { configurationInterface };