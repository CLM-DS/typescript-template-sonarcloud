import { Context } from 'koa'
import { httpStatus, serverStatus } from '../constants';

/**
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {boolean}
 */
const checkDB = (ctx: Context) => {
  const { config = {}, db } = ctx;

  if (config.mongoUri && db) {
    return true;
  }

  if (!config.mongoUri) {
    return true;
  }

  return false;
};

/**
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {boolean}
 */
const checkBroker = (ctx: Context) => {
  const { config = {}, pool } = ctx;

  if (config.brokerConfig && Object.keys(config.brokerConfig).length > 0 && pool) {
    return true;
  }

  if (!config.brokerConfig || Object.keys(config.brokerConfig).length === 0) {
    return true;
  }

  return false;
};

/**
 * Verity ctx
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {('UP' | undefined)}
 */
const checkCtx = (ctx: Context) => {
  if (ctx.log && checkDB(ctx) && checkBroker(ctx)) {
    return serverStatus.UP;
  }

  return undefined;
};

/**
 * ctx check correct
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {import('../server/middlewares').ContextStd}
 */
const healthy = (ctx: Context): Context => {
  const status = checkCtx(ctx);
  
  if (!status) {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
  } else {
    ctx.status = httpStatus.statusCodes.OK;
  }

  ctx.body = {
    status: status || serverStatus.DOWN,
  };

  return ctx;
};

const isAliveDB = (ctx: Context) => {
  const { config = {}, db } = ctx;

  if (config.mongoUri && db && db.isConnected()) {
    return true;
  }

  if (!config.mongoUri) {
    return true;
  }

  return false;
};

const isAlivePool = (ctx: Context) => {
  const { config = {}, pool } = ctx;
  const haveBrokerConfig = config.brokerConfig && Object.keys(config.brokerConfig).length > 0;

  if (haveBrokerConfig && pool && !pool.haveError()) {
    return true;
  }

  if (!config.brokerConfig || Object.keys(config.brokerConfig).length === 0) {
    return true;
  }

  return false;
};

/**
 * Check database and dependency load correct
 * @param {import('../server/middlewares').ContextStd} ctx
 * @returns {import('../server/middlewares').ContextStd}
 */
const alive = (ctx: Context): Context => {
  if (isAliveDB(ctx) && isAlivePool(ctx)) {
    ctx.body = { status: 'UP' };
    ctx.status = httpStatus.statusCodes.OK;
  } else {
    ctx.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
    ctx.body = { status: 'DOWN' };
  }

  return ctx;
};

 export { alive, healthy };
