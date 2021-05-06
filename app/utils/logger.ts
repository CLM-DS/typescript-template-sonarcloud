import Pino from 'pino';
import { LoggerOptions } from 'pino';

const createLogger = (optionsIn?: LoggerOptions): ReturnType<typeof Pino> => {
  const env = process.env.NODE_ENV || 'development';
  const name = process.env.APP_NAME;
  const enable = !!process.env.LOG_ENABLED;
  const options = optionsIn || {
    enabled:
      enable || ['production', 'development'].includes(env),
    name,
    level: process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug'),
    customLevels: { healthy: 0 },
    redact: [],
  };
  
  return Pino(options);
};

export { createLogger };
