import { Context, Next } from 'koa';
import { ConfigurationInterface } from '../../interfaces';

/**
 * Added Config to context
 * @params {options}
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const configMiddleware = (options: ConfigurationInterface) => async (
  ctx: Context, next: Next,
): Promise<Context> => {
  ctx.config = options;
  await next();
  return ctx;
};

export { configMiddleware };
