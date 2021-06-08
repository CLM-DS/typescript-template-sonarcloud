import { loggerMiddleware } from '../../app/server/middlewares/loggerMiddleware';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('Test Cases: MonitorMiddleware', () => {
  it('Test Case log request', async () => {
    const ctxMock = createMockContext();
    const nextMock = jest.fn(() => Promise.resolve());

    await loggerMiddleware()(ctxMock, nextMock);
    expect(ctxMock.log).toBeDefined();
  });
});