import { Context, Next } from 'koa';
import { MiddlewareInterface } from '../../interfaces';

/**
 * Added mongo client
 * @param {import('../../config').Config} options
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const mongoMiddleware = (connection: MiddlewareInterface['db']) => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.db = connection;
  await next();
  return ctx;
};

export { mongoMiddleware };
