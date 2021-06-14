import { Context } from 'koa';
import { healthy, alive } from '../services/statusService';

const handlerHealthy = (ctx: Context): Context => healthy(ctx);
const handlerAlive = (ctx: Context): Context => alive(ctx);

export { handlerHealthy, handlerAlive };
