import { Logger } from 'pino';
import { WrapperDBInterface } from '../utils/wrapperDB';
import { PoolInterface } from './poolInterface';
import { ConfigurationInterface } from './configurationInterface';

declare module 'koa' {
  interface Context {
    config: ConfigurationInterface;
    pool?: PoolInterface;
    db?: WrapperDBInterface;
    log: Logger;
  }
}
