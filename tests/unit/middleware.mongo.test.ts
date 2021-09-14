jest.mock('../../app/utils');
jest.mock('mongodb');

import { createMockContext } from '@shopify/jest-koa-mocks';
import { mongoMiddleware } from '../../app/server/middlewares/mongoMiddleware';
import { wrapperDB } from '../../app/utils';

describe('Test Cases: MongoMiddleware', () => {
  it('Test Case attach db', async () => {
    const ctxMock = createMockContext();
    const dbMock = wrapperDB as jest.Mocked<typeof wrapperDB>;
    const nextMock = jest.fn(() => Promise.resolve());

    await mongoMiddleware(dbMock)(ctxMock, nextMock);
    expect(ctxMock.db).not.toEqual(undefined);
  });
});
