import joi from 'joi';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { Context } from 'koa';
import { httpStatus } from '../../app/constants';
import { useValidation } from '../../app/utils/validator';
import { createMockLogger, createMockRequest } from '../mocks';

describe('Test Cases: validator', () => {
  it('Test schema validation failure', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    const scheme = joi.object({
      orderId: joi.required(),
    });
    const validation = useValidation([{
      property: 'request.body',
      scheme,
    }], (c) => c)(ctxMock);
    const response = { message: 'Data not found', property: 'request.body' };

    expect(ctxMock.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
    expect((validation as Context).response.body).toEqual(response);
  });

  it('Test schema validation success', () => {
    const ctxMock = createMockContext({ ...createMockRequest });
    ctxMock.log = createMockLogger;
    const scheme = joi.object({
      orderId: joi.required(),
    });
    const validation = useValidation([{
      property: 'request.body',
      scheme,
    }], (ctx) => {
      ctx.status = httpStatus.statusCodes.OK;
      return ctx;
    })(ctxMock);

    expect(ctxMock.status).toEqual(httpStatus.statusCodes.OK);
    expect((validation as Context).response.body).toBeUndefined();
  });

  it('Test schema validation failure on body property', () => {
    const ctxMock = createMockContext({ ...createMockRequest });
    ctxMock.log = createMockLogger;
    const scheme = joi.object({
      orderId: joi.required(),
    });
    const validation = useValidation([{
      property: 'request.body',
      scheme,
    },
    {
      property: 'body',
      scheme,
    }], (ctx) => {
      ctx.status = httpStatus.statusCodes.OK;
      return ctx;
    })(ctxMock);
    const response = { message: 'Data not found', property: 'body' };

    expect(ctxMock.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
    expect((validation as Context).response.body).toEqual(response);
  });

  it('Test schema validation failure on request.body property', () => {
    const ctxMock = createMockContext();
    ctxMock.log = createMockLogger;
    const scheme = joi.object({
      orderId: joi.required(),
    });
    const validation = useValidation([{
      property: 'request.body',
      scheme,
    },
    {
      property: 'body',
      scheme,
    }], (ctx) => {
      ctx.status = httpStatus.statusCodes.OK;
      return ctx;
    })(ctxMock);
    const response = { message: 'Data not found', property: 'request.body' };

    expect(ctxMock.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
    expect((validation as Context).response.body).toEqual(response);
  });
});
