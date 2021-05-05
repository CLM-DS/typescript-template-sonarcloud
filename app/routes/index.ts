import { RouteInterface } from '../interfaces';
import { createRouterStatus } from './statusRoute';

/**
 * create route in server koa
 * @param {*} app koa instance server
 * @param {*} router koa router instance
 * @param {*} options app options globals
 */
const useRoute = (app: RouteInterface['app'], router: ReturnType<typeof createRouterStatus>, options: RouteInterface['options']) => {
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
const useRoutes = (args: RouteInterface): RouteInterface['app'] => {
  const { app, options } = args;
  useRoute(app, createRouterStatus(), options);
  args.log.info('Routes Loaded');
  return app;
};

export { useRoutes };
