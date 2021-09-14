jest.mock('../../app/services/statusService');

import { createMockContext } from '@shopify/jest-koa-mocks';
import { httpStatus, serverStatus } from '../../app/constants';
import { healthy, alive } from '../../app/services/statusService';
import { handlerAlive, handlerHealthy } from '../../app/controllers/statusController';

describe('Test Cases Status Controller', () => {
  it('Test healthy status', () => {
    const ctxMock = createMockContext();
    ctxMock.status = 200;
    ctxMock.body = { status: serverStatus.UP };
    const healthyMock = healthy as jest.MockedFunction<typeof healthy>;
    healthyMock.mockReturnValueOnce(ctxMock);
    const context = handlerHealthy(createMockContext());
    expect(context.status).toBe(httpStatus.statusCodes.OK);
    expect(context.body).toStrictEqual({ status: serverStatus.UP });
  });

  it('Test non healthy status', () => {
    const ctxMock = createMockContext();
    ctxMock.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
    ctxMock.body = { status: serverStatus.DOWN };
    const healthyMock = healthy as jest.MockedFunction<typeof healthy>;
    healthyMock.mockReturnValueOnce(ctxMock);
    const context = handlerHealthy(createMockContext());
    expect(context.status).toBe(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
    expect(context.body).toStrictEqual({ status: serverStatus.DOWN });
  });

  it('Test alive status', () => {
    const ctxMock = createMockContext();
    ctxMock.status = httpStatus.statusCodes.OK;
    ctxMock.body = { status: serverStatus.UP };
    const aliveMock = alive as jest.MockedFunction<typeof alive>;
    aliveMock.mockReturnValueOnce(ctxMock);
    const context = handlerAlive(createMockContext());
    expect(context.status).toBe(httpStatus.statusCodes.OK);
    expect(context.body).toStrictEqual({ status: serverStatus.UP });
  });

  it('Test non alive status', () => {
    const ctxMock = createMockContext();
    ctxMock.status = httpStatus.statusCodes.SERVICE_UNAVAILABLE;
    ctxMock.body = { status: serverStatus.DOWN };
    const aliveMock = alive as jest.MockedFunction<typeof alive>;
    aliveMock.mockReturnValueOnce(ctxMock);
    const context = handlerAlive(createMockContext());
    expect(context.status).toBe(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
    expect(context.body).toStrictEqual({ status: serverStatus.DOWN });
  });
});
