import { statusCodes } from '../../app/constants/httpStatus';
import { errorMiddleware } from '../../app/server/middlewares/errorMiddleware';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { createMockServer } from '../mocks';
import { startServer } from '../../app/server';

describe('Test Cases: ErrorMiddleware', () => {
  it('Test Case error call', async () => {
    const config = createMockServer();
    const app = await startServer(config);
    const ctxMock = createMockContext();
    const handlerError = () => {
      throw new Error('Mock Error');
    };

    try {
      await errorMiddleware(app)(ctxMock, handlerError);
    } catch (error) {
      // console.log(error);
    }

    expect(ctxMock.status).toEqual(statusCodes.INTERNAL_SERVER_ERROR);
  });
});