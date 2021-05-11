import { BrokerConfigurationInterface } from '@models/configurationInterface';
import { Context, Next } from 'koa';
import * as logger from '../../utils/logger';

/**
 * Added log to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const loggerMiddleware = () => async (ctx: Context, next: Next): Promise<Context> => {
  const { config = {} as BrokerConfigurationInterface } = ctx;
  ctx.log = logger.createLogger(config.log);
  await next();
  return ctx;
};

export { loggerMiddleware };
