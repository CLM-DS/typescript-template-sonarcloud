import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { configMiddleware } from './configMiddleware';
import { errorMiddleware } from './errorMiddleware';
import { loggerMiddleware } from './loggerMiddleware';
import { mongoMiddleware } from './mongoMiddleware';
import { monitorMiddleware } from './monitorMiddleware';
import { brokerMiddleware } from './brokerMiddleware';
import { MiddlewareInterface } from '../../interfaces';

/**
 * @typedef {Object} Argument
 * @property {import('koa')} app
 * @property {import('../../config').Config} options
 * @property {import('../../utils/broker').PoolBroker} pool
 * @property {import('mongodb').MongoClient} db
 */

/**
 * @typedef {Object} ContextGeneric
 * @property {import('../../config').Config} config
 * @property {import('pino').Logger} log
 * @property {import('mongodb').MongoClient} db
 * @property {import('../../utils/broker').PoolBroker} pool
 */

/**
 * @typedef {ContextGeneric & import('koa').Context} ContextStd
 */

/**
 * Configure all middleware to application
 * @param {Argument} args
 * @returns {import('koa')}
 */
const useMiddleware = (args: MiddlewareInterface): Koa => {
  const {
    app,
    options,
    pool,
    db,
  } = args;
  app.use(bodyParser());
  // errorMiddleware must not move, this must be the first middleware to be used
  app.use(errorMiddleware(app));
  app.use(configMiddleware(options));
  app.use(loggerMiddleware());
  app.use(monitorMiddleware());
  // added client mongo to middleware
  app.use(mongoMiddleware(db));
  // added instance to managed broker
  app.use(brokerMiddleware(pool));
  return app;
};

export { useMiddleware };
