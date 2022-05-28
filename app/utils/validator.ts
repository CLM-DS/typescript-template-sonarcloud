import { Schema, ValidationError } from 'joi';
import { Context } from 'koa';
import xss from 'xss';
import { statusCodes } from '../constants/httpStatus';

/**
 * @typedef {Object} SchemeValidation
 * @property {string} property
 * @property {import('joi').ObjectSchema} scheme
 */

/**
 *
 * @typedef {import('../server/middlewares').ContextStd} Context
 */

/**
 * Get property access
 * @param {string} property
 * @param {Context} ctx
 */
const getProperty = (property: string, ctx: Context) => {
  const properties = property.split('.');
  return properties.reduce<undefined | Record<string, unknown>>(
    (acc, prop) => (acc ? acc[prop] : ctx[prop]) as Record<string, unknown>,
    undefined,
  );
};

/**
 * Set property access
 * @param {string} property
 * @param {string} value
 * @param {Context} ctx
 */
const setProperty = (property: string, value: unknown, ctx: Context) => {
  const properties = property.split('.');
  let access = ctx;
  for (let i = 0; i <= properties.length - 2; i += 1) {
    const prop = properties[i];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    access = access[prop];
  }
  const prop = properties[properties.length - 1];
  access[prop] = value;
};

interface CustomError {
  property: string;
  message: string;
}
interface ResultValidator {
  [key: string]: ValidationError | CustomError;
}
export interface SchemeValidator {
  property: string;
  scheme: Schema;
}
export type SchemeError = ResultValidator | CustomError | ValidationError | undefined;

/**
 * Evaluate Schemas
 * @param {SchemeValidation[]} schemas
 * @param {Context} ctx
 * @param {boolean} abort
 */
const evaluateSchemes = (
  schemas: SchemeValidator[], ctx: Context, abort = true,
): SchemeError => schemas.reduce<SchemeError>((acc, item) => {
  if (acc && abort) {
    return acc;
  }

  const { property, scheme } = item;
  const data = getProperty(property, ctx);

  if (!data) {
    const e = {
      property,
      message: 'Data not found',
    };
    return abort ? e : { ...(acc || {}), [property]: e };
  }

  const validation = scheme.validate(data);

  if (validation.error) {
    return abort ? validation.error : { ...(acc || {}), [property]: validation.error };
  }

  setProperty(property, validation.value, ctx);
  return acc;
}, undefined);

/**
 * @callback TransformCallback
 * @param {*} error
 * @param {ContextStd} ctx
 * @returns {*}
 */

/**
 * @typedef {Object} ValidatorOptions
 * @property {boolean} abort stop in first error check
 * @property {TransformCallback} transform option to transform error
 */
type ValidatorOptions = {
  abort?: boolean;
  transform?: (error: SchemeError, ctx?: Context) => any;
};

/**
 *
 * @param {[SchemeValidation]} schemas
 * @param {*} obj
 * @param {ValidatorOptions} options
 */
const useValidationObject = (
  schemas: SchemeValidator[], obj: never, options: ValidatorOptions = {},
) => {
  const { abort = true } = options;
  const err = evaluateSchemes(schemas, obj, abort);

  if (!err) {
    return obj;
  }

  if (options.transform) {
    throw options.transform(err);
  }

  throw err as unknown;
};

/**
 *
 * @param {[SchemeValidation]} schemas
 * @param {*} handler
 * @param {ValidatorOptions} options
 * @returns {(ctx: Context) => Context}
 */
export type CallbackKoa = (ctx: Context) => Context | Promise<Context>;
const useValidation = (
  schemas: SchemeValidator[], handler: CallbackKoa, options: ValidatorOptions = {},
) => (ctx: Context): Context | Promise<Context> => {
  const { abort = true } = options;
  const err = evaluateSchemes(schemas, ctx, abort);

  if (!err) {
    return handler(ctx);
  }

  const errMsg = (options.transform ? options.transform(err, ctx) : err) as Record<string, unknown>;

  ctx.log.error(errMsg, 'Validation Error');
  ctx.status = statusCodes.BAD_REQUEST;
  ctx.body = JSON.parse(xss(JSON.stringify(errMsg)));
  ctx.log.error(err, 'Validation Error');

  return ctx;
};

export { useValidation, useValidationObject };
