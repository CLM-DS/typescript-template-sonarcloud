import { Context, Next } from 'koa';
import { Logger } from 'pino';

/**
 * Added log to context
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const loggerMiddleware = (logger: Logger) => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.log = logger;
  await next();
  return ctx;
};

export { loggerMiddleware };
