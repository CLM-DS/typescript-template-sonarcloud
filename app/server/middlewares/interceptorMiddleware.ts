import { Context, Next } from 'koa';
import { uuid } from 'uuidv4';

/**
 * Intercept request and add information.
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const interceptorMiddleware = () => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.request.header['x-txref'] = ctx.request.header['x-txref'] || uuid();
  await next();
  return ctx;
};

export { interceptorMiddleware };
