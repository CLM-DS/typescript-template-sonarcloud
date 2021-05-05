import Koa from 'koa';
import { Context, Next } from 'koa';
import { statusCodes } from '../../constants/httpStatus';
import { createLogger } from '../../utils/logger';

/**
 * Handler from error
 * @param {Error} err
 * @param {import('./index').ContextStd} ctx
 */
const handlerError = (err: Error, ctx: Context) => {
  const { log = createLogger() } = ctx;
  
  log.error({
    req: ctx.request,
    err,
  });
};

/**
 * Added Handler Error to Application
 * @param {import('koa')} app
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const errorMiddleware = (app: Koa) => {
  app.on('error', handlerError);

  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = statusCodes.INTERNAL_SERVER_ERROR;
      ctx.app.emit('error', err, ctx);
    }
    
    return ctx;
  };
};

export { errorMiddleware };
