import { Context, Next } from 'koa';
import { MiddlewareInterface } from '../../interfaces';

/**
 * Added Config to context
 * @param {import('../../utils/broker').PoolBroker} pool
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const brokerMiddleware = (pool: MiddlewareInterface['pool']) => async (ctx: Context, next: Next): Promise<Context> => {
  ctx.pool = pool;
  await next();
  return ctx;
};

export { brokerMiddleware };
