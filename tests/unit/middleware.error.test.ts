import { statusCodes } from '../../app/constants/httpStatus';
import { errorMiddleware } from '../../app/server/middlewares/errorMiddleware';
import { createMockContext } from '@shopify/jest-koa-mocks';
import Koa from 'koa';
import { createMockLogger } from '../mocks';

describe('Test Cases: ErrorMiddleware', () => {
  it('Test Case error call', async () => {
    const app = new Koa();
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    ctxMock.app = app;
    const handlerError = () => {
      throw new Error('Mock Error');
    };

    try {
      await errorMiddleware(app)(ctxMock, handlerError);
    } catch (error) {
      //console.log(error);
    }

    expect(ctxMock.status).toEqual(statusCodes.INTERNAL_SERVER_ERROR);
  });
});