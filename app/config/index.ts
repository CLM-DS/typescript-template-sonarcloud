import { ConfigurationInterface, SecretInterface } from '../interfaces';

/**
 * Return configuration object
 * @param {SecretInterface} secrets - Secret values to load the confihuration.
 * @returns {ConfigurationInterface} Configuration object
 */
const loadConfig = (secrets: SecretInterface): ConfigurationInterface => ({
  prefix: process.env.APP_PREFIX || '',
  port: parseInt(process.env.PORT || '3000'),
  mongoUri: secrets.get('MONGO_DB_URL') || '',
  dataSource: secrets.get('DATABASE_NAME') || '',
});

export { loadConfig };
