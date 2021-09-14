import { createMockContext } from '@shopify/jest-koa-mocks';
import { brokerMiddleware } from '../../app/server/middlewares/brokerMiddleware';
import { createMockPool } from '../mocks/mockPool';

describe('Test Cases: brokerMiddleware', () => {
  it('Test pool creation', async () => {
    const ctxMock = createMockContext();
    const nextMock = jest.fn(() => Promise.resolve());
    const poolMock = createMockPool(true);

    await brokerMiddleware(poolMock)(ctxMock, nextMock);
    expect(ctxMock.pool).not.toEqual(undefined);
  });
});
