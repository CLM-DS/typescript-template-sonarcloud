import { Logger } from 'pino';
import { WrapperDB } from '../utils/wrapperDB';
import { PoolInterface } from './poolInterface';
import { BrokerConfigurationInterface } from './configurationInterface';

declare module 'koa' {
  interface Context {
    config: BrokerConfigurationInterface;
    pool?: PoolInterface;
    db?: WrapperDB;
    log: Logger;
  }
}
