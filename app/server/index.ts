import Koa from 'koa';
import { Logger } from 'pino';
import * as db from '../utils/wrapperDB';
import { useRoutes } from '../routes';
import { useMiddleware } from './middlewares';
import { createLogger } from '../utils/logger';
import { useListeners } from '../listeners';
import { ConfigurationInterface } from '../interfaces/configurationInterface';

export interface AppInstance {
  options: ConfigurationInterface;
  db?: db.WrapperDBInterface;
  log: Logger;
}
/**
 * @type {import('koa')}
 */
let app: Koa;

/**
 *
 * @param {import('../config').Config} options
 * @returns {import('koa')}
 */
const startServer = (options: ConfigurationInterface): Koa => {
  const logger = createLogger(options.log);
  logger.info('Server Initialize');

  // create Koa instance
  app = new Koa();

  // create connection to database
  db.connect(options);

  // create connection to broker and listener message
  const pool = useListeners({
    options,
    db,
    log: logger,
  });

  // load middleware to app
  useMiddleware({
    options,
    app,
    pool,
    db,
    logger,
  });
  logger.info('Server Middleware Loaded');

  // load routes to app
  useRoutes({
    options,
    app,
    log: logger,
  });
  logger.info('Server Routes Loaded');

  app.listen(options.port, () => {
    logger.info(`Server Listen Port: ${options.port as number}`);
  });
  logger.info('Server Loaded');

  return app;
};

/**
 * Stop application active
 */
const stopServer = (): Koa => {
  app.removeAllListeners();

  return app;
};

export { startServer, stopServer };
