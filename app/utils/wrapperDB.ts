/* eslint-disable import/no-mutable-exports */
import {
  FilterQuery, InsertOneWriteOpResult, InsertWriteOpResult,
  MongoClient, UpdateQuery, UpdateWriteOpResult,
} from 'mongodb';
import { ConfigurationInterface } from '../interfaces/configurationInterface';
import { createLogger } from './logger';

/**
 * Client from Mongo Connection
 * @type {MongoClient}
 */
let client: MongoClient;
/**
 * Database name
 * @type {string}
 */
let dataSource = '';

/**
 * Connect to database
 * @param {import('../config').Config} options
 * @param {boolean} force
 * @returns {MongoClient}
 */
export type Connect = (options: ConfigurationInterface) => MongoClient | undefined;
const connect: Connect = (options) => {
  const logger = createLogger(options.log);
  const { mongoUri, dataSource: dataSourceName } = options;

  if (!mongoUri || !dataSourceName) {
    logger.info('no DB URI Detected, skipping connection!');
    return undefined;
  }

  if (client) {
    return client;
  }

  client = new MongoClient(mongoUri, { useUnifiedTopology: true });

  client.connect((resp) => {
    if (resp && resp.message) {
      logger.error(resp);
    } else {
      dataSource = options.dataSource as string;
      logger.info('DB Connection Success');
    }
  });

  return client;
};

/**
 * Find one document in collection
 * @param {string} collection
 * @param {import('mongodb').FilterQuery} query
 * @returns {Promise<*>}
 */
export type FindOne = <T>(collection: string, query: FilterQuery<T>) => Promise<unknown>;
const findOne: FindOne = (collection, query = {}) => {
  const database = client.db(dataSource);
  return database.collection(collection).findOne(query);
};

/**
 * Find all document in collection
 * @param {string} collection
 * @param {import('mongodb').FilterQuery} query
 * @returns {Promise<[*]>}
 */
export type Find = <T>(collection: string, query: FilterQuery<T>) => Promise<unknown[]>;
const find: Find = (collection, query = {}) => {
  const database = client.db(dataSource);
  return database.collection(collection).find(query).toArray();
};

/**
 * Create one document in collection
 * @param {string} collection
 * @param {*} data
 * @returns {Promise<import('mongodb').InsertOneWriteOpResult>}
 */
export type Create = <T extends { _id: any }>
(collection: string, data: T) => Promise<InsertOneWriteOpResult<any>>;
const create: Create = (collection, data) => {
  const database = client.db(dataSource);
  return database.collection(collection).insertOne(data);
};

/**
 * Create documents in batch on collection
 * @param {string} collection
 * @param {[*]} data
 * @returns {Promise<import('mongodb').InsertWriteOpResult>}
 */
export type CreateBatch = <T extends { _id: any }>
(collection: string, data: T[]) => Promise<InsertWriteOpResult<any>>;
const createBatch: CreateBatch = (collection, data) => {
  const database = client.db(dataSource);
  return database.collection(collection).insertMany(data);
};

/**
 * update one document in collection
 * @param {string} collection
 * @param {*} filter filter to find document
 * @param {*} dataUpdate data partial or complete from document to update
 * @returns {Promise<import('mongodb').UpdateWriteOpResult>}
 */
export type Update = <T>
(collection: string, filter: FilterQuery<T>, data: UpdateQuery<T>) => Promise<UpdateWriteOpResult>;
const update: Update = (collection, filter, dataUpdate) => {
  const database = client.db(dataSource);
  return database.collection(collection).updateOne(filter, dataUpdate);
};

/**
 * update multiple documents in collection
 * @param {string} collection
 * @param {*} filter filter to find document
 * @param {*} data data partial or complete from document to update
 * @returns {Promise<import('mongodb').UpdateWriteOpResult>}
 */
export type UpdateBatch = <T>
(collection: string, filter: FilterQuery<T>, data: UpdateQuery<T>) => Promise<UpdateWriteOpResult>;
const updateBatch: UpdateBatch = (collection, filter, dataUpdate) => {
  const database = client.db(dataSource);
  return database.collection(collection).updateMany(filter, dataUpdate);
};
export type IsConnected = () => boolean;
const isConnected: IsConnected = () => client.isConnected();

export {
  create,
  createBatch,
  update,
  updateBatch,
  find,
  findOne,
  connect,
  client,
  isConnected,
  dataSource,
};

export interface WrapperDB {
  create: Create,
  createBatch: CreateBatch,
  update: Update,
  updateBatch: UpdateBatch,
  find: Find,
  findOne: FindOne,
  connect: Connect,
  client: MongoClient,
  isConnected: IsConnected,
  dataSource: string,
}
