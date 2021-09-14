import { Context, Next } from 'koa';
import { PoolInterface } from '../../interfaces';

/**
 * Added Config to context
 * @param {import('../../utils/broker').PoolBroker} pool
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const brokerMiddleware = (pool: PoolInterface | undefined) => async (
  ctx: Context, next: Next,
): Promise<Context> => {
  ctx.pool = pool;
  await next();
  return ctx;
};

export { brokerMiddleware };
