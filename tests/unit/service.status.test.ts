import { createMockContext } from '@shopify/jest-koa-mocks';
import { httpStatus } from '../../app/constants';
import { statusService } from '../../app/services';
import { createMockConfig, createMockLogger, createMockPool } from '../mocks';
import * as db from '../../app/utils/wrapperDB';

jest.mock('../../app/utils/wrapperDB');

describe('Test Cases: Status Service', () => {
  it('Test Status Healthy Success', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Healthy Failure', () => {
    const ctxMock = createMockContext();
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Alive Success', () => {
    const ctxMock = createMockContext();
    ctxMock.config = { brokerConfig: {} };
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Alive Failure', () => {
    const ctxMock = createMockContext();
    ctxMock.config = createMockConfig;
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Alive Success with DB', () => {
    const ctxMock = createMockContext();
    const dbMock = db as jest.Mocked<typeof db>;
    dbMock.isConnected.mockReturnValueOnce(true);
    ctxMock.db = dbMock;
    ctxMock.config = createMockConfig;
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Alive Success with Pool', () => {
    const ctxMock = createMockContext();
    ctxMock.pool = createMockPool(true);
    ctxMock.config = { brokerConfig: { kafkaConsumer: { type: 'kafka' } } };
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Alive Failure with no Pool', () => {
    const ctxMock = createMockContext();
    ctxMock.config = { brokerConfig: { kafkaConsumer: { type: 'kafka' } } };
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });
});
