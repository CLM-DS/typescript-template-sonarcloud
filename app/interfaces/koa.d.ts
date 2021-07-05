import { Logger } from 'pino';
import { WrapperDBInterface } from '../utils/wrapperDB';
import { PoolInterface } from './poolInterface';
import { BrokerConfigurationInterface } from './configurationInterface';

declare module 'koa' {
  interface Context {
    config: BrokerConfigurationInterface;
    pool?: PoolInterface;
    db?: WrapperDBInterface;
    log: Logger;
  }
}
