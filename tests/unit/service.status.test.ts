import { httpStatus } from '../../app/constants';
import { statusService } from '../../app/services';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { createLogger } from '../../app/utils/logger';
import { createMockConfig } from '../mocks';

describe('Test Cases: Status Service', () => {
  it('Test Status Healthy Success', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createLogger();
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
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Status Alive Failure', () => {
    const ctxMock = createMockContext();
    ctxMock.config = createMockConfig; 
    const res = statusService.alive(ctxMock);
    expect(res.status).toEqual(httpStatus.statusCodes.SERVICE_UNAVAILABLE);
  });
});
