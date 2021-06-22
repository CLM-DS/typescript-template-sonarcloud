import { Context, Next } from 'koa';
import { v4 as uuidv4 } from 'uuid';

/**
 * Intercept request and add information.
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const interceptorMiddleware = () => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.request.header['x-txref'] ||= uuidv4();
  await next();
  return ctx;
};

export { interceptorMiddleware };
