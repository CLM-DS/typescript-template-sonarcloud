jest.mock('../../app/utils/wrapperDB');

import { createMockContext } from '@shopify/jest-koa-mocks';
import { httpStatus } from '../../app/constants';
import { statusService } from '../../app/services';
import {
  createMockConfig, createMockDB, createMockLogger, createMockMongoConfig, createMockPool,
} from '../mocks';
import * as db from '../../app/utils/wrapperDB';

describe('Test Cases: Status Service', () => {
  it('Test Status Healthy Success', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Healthy Success with DB', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    ctxMock.db = createMockDB;
    ctxMock.config = createMockMongoConfig;
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Healthy Success with Broker and Pool', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    ctxMock.config = { brokerConfig: { kafkaProducer: { type: 'kafka', onCrash: () => {} } } };
    ctxMock.pool = createMockPool(true);
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Healthy Failure', () => {
    const ctxMock = createMockContext();
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Healthy Failure with no DB', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    ctxMock.config = createMockMongoConfig;
    const res = statusService.healthy(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Healthy Failure with empty Broker', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    ctxMock.config = { brokerConfig: { kafkaProducer: { type: 'kafka', onCrash: () => {} } } };
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
    ctxMock.config = { brokerConfig: { kafkaConsumer: { type: 'kafka', onCrash: () => {} } } };
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Alive Failure with no Pool', () => {
    const ctxMock = createMockContext();
    ctxMock.config = { brokerConfig: { kafkaConsumer: { type: 'kafka', onCrash: () => {} } } };
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });
});
