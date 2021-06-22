import { createMockContext } from '@shopify/jest-koa-mocks';
import { interceptorMiddleware } from '../../app/server/middlewares/interceptorMiddleware';
import { createMockRequest } from '../mocks';

describe('Test Cases: InterceptorMiddleware', () => {
  it('Test Case header x-txref to be defined', async () => {
    const ctxMock = createMockContext({ ...createMockRequest });
    const nextMock = jest.fn(() => Promise.resolve());

    await interceptorMiddleware()(ctxMock, nextMock);
    expect(ctxMock.request.header['x-txref']).toBeDefined();
    expect(ctxMock.request.header['x-txref']).toEqual('a');
  });
});
