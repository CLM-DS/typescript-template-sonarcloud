import { routeInterface } from '../interfaces';
import { createRouterStatus } from './statusRoute';

/**
 * create route in server koa
 * @param {*} app koa instance server
 * @param {*} router koa router instance
 * @param {*} options app options globals
 */
const useRoute = (app: routeInterface['app'], router: ReturnType<typeof createRouterStatus>, options: routeInterface['options']) => {
  const { prefix } = options;
  router.prefix(prefix);
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};
/**
 * Load all routes in app
 * @param {*} args
 */
const useRoutes = (args: routeInterface): routeInterface['app'] => {
  const { app, options } = args;
  useRoute(app, createRouterStatus(), options);
  args.log.info('Routes Loaded');
  return app;
};

export { useRoutes };
