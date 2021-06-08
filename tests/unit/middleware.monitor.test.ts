import { monitorMiddleware } from '../../app/server/middlewares/monitorMiddleware';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { createMockRequest } from '../mocks';
import { createLogger } from '../../app/utils/logger';

describe('Test Cases: MonitorMiddleware', () => {
  it('Test Case log request', async () => {
    const ctxMock = createMockContext({...createMockRequest});
    ctxMock.log = createLogger();
    const nextMock = jest.fn(() => Promise.resolve());
    const spy = jest.spyOn(ctxMock.log, 'info');
    await monitorMiddleware()(ctxMock, nextMock);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});