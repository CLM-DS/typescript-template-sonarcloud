import { ConfigurationInterface, SecretInterface } from '../interfaces';

/**
 * Return configuration object
 * @param {SecretInterface} secrets - Secret values to load the confihuration.
 * @returns {ConfigurationInterface} Configuration object
 */
export const loadConfig = (secrets: SecretInterface): ConfigurationInterface => ({
  prefix: process.env.APP_PREFIX || '',
  port: Number(process.env.PORT || '3000'),
  mongoUri: secrets.get('MONGO_DB_URL') || '',
  dataSource: secrets.get('DATABASE_NAME') || '',
});
