import { ConfigurationInterface } from '../../app/interfaces';

/**
 * Return configuration object
 * @returns {ConfigurationInterface} Configuration object
 */

export const createMockServer = (): ConfigurationInterface => ({
    prefix: '',
    port: 3000,
    mongoUri: '',
    dataSource: '',
  });

   