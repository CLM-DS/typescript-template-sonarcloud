import { createMockContext } from '@shopify/jest-koa-mocks';
import { createMockLogger } from '../mocks';
import { loggerMiddleware } from '../../app/server/middlewares/loggerMiddleware';

describe('Test Cases: MonitorMiddleware', () => {
  it('Test Case log request', async () => {
    const ctxMock = createMockContext();
    const nextMock = jest.fn(() => Promise.resolve());
    const mockLogger = createMockLogger;

    await loggerMiddleware(mockLogger)(ctxMock, nextMock);
    expect(ctxMock.log).toBeDefined();
  });
});
