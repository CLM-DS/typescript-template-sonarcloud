import Router from 'koa-router';
import { handlerAlive, handlerHealthy } from '../controllers/statusController';

const createRouterStatus = () => {
  const router = new Router();
  router.get('/status/healthy', handlerHealthy as any);
  router.get('/status/alive', handlerAlive as any);
  
  return router;
};

export { createRouterStatus };
