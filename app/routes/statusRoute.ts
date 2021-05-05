const Router = require('koa-router');
import { handlerAlive, handlerHealthy } from '../controllers/statusController';

const createRouterStatus = () => {
  const router = new Router();

  router.get('/status/healthy', handlerHealthy);
  router.get('/status/alive', handlerAlive);
  
  return router;
};

export { createRouterStatus };
