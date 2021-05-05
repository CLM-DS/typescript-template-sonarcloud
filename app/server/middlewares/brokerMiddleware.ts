import { Context, Next } from 'koa';
import { middlewareInterface } from '../../interfaces';

/**
 * Added Config to context
 * @param {import('../../utils/broker').PoolBroker} pool
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const brokerMiddleware = (pool: middlewareInterface['pool']) => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.pool = pool;
  await next();
  return ctx;
};

export { brokerMiddleware };
