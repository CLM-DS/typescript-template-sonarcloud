import { MongoClient } from 'mongodb';

export const createMockDB = {
  create: jest.fn(),
  createBatch: jest.fn(),
  update: jest.fn(),
  updateBatch: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  connect: jest.fn(),
  client: jest.fn() as unknown as MongoClient,
  isConnected: jest.fn(),
  dataSource: 'test',
};
