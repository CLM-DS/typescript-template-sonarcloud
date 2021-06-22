import Router from 'koa-router';
import { handlerAlive, handlerHealthy } from '../controllers/statusController';

const createRouterStatus = (): Router => {
  const router = new Router();
  router.get('/status/healthy', handlerHealthy as never);
  router.get('/status/alive', handlerAlive as never);

  return router;
};

export { createRouterStatus };
