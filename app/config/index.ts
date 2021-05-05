import { configurationInterface, secretInterface } from '../interfaces';

/**
 * Return configuration object
 * @param {secretInterface} secrets - Secret values to load the confihuration.
 * @returns {configurationInterface} Configuration object
 */
const loadConfig = (secrets: secretInterface): configurationInterface => ({
  prefix: process.env.APP_PREFIX || '',
  port: parseInt(process.env.PORT || '3000'),
  mongoUri: secrets.get('MONGO_DB_URL') || '',
  dataSource: secrets.get('DATABASE_NAME') || '',
});

export { loadConfig };
