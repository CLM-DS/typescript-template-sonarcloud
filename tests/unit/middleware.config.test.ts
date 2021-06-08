import { configMiddleware } from '../../app/server/middlewares/configMiddleware';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { createMockConfig } from '../mocks/mockConfig';

describe('Test Cases: ConfigMiddleware', () => {
  it('Test config creation', async () => {
    const ctxMock = createMockContext();
    const nextMock = jest.fn(() => Promise.resolve());
    const configMock = createMockConfig;

    await configMiddleware(configMock)(ctxMock, nextMock);

    expect(ctxMock.config).not.toEqual(undefined);
  });
});