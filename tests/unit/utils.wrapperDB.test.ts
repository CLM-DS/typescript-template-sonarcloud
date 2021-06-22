/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MongoClient } from 'mongodb';
import mongoMocks from '../mocks/mockMongo';
import { mockConfigSimple } from '../mocks/mockMongoConfig';
import * as wrapper from '../../app/utils/wrapperDB';

jest.mock('mongodb');

describe('Test Cases: wrapperDB', () => {
  /**
   * @type {import("mongodb").MongoClient}
   */
  let client: MongoClient | undefined;
  let db: jest.MockedFunction<any>;

  beforeEach(() => {
    client = wrapper.connect(mockConfigSimple);
    db = (client as MongoClient).db;
  });
  it('Test Find One', async () => {
    db.mockReturnValueOnce(mongoMocks.mockFindOne);
    const data = await wrapper.findOne('test', {});
    expect(data).not.toEqual(undefined);
  });

  it('Test Find', async () => {
    db.mockReturnValueOnce(mongoMocks.mockFind);
    const data = await wrapper.find('test', {});
    expect(data).not.toEqual(undefined);
  });

  it('Test Create', async () => {
    db.mockReturnValueOnce(mongoMocks.mockInsertOne);
    const data = await wrapper.create('', { test: 'test', _id: '' });
    expect(data).not.toEqual(undefined);
  });

  it('Test Create Batch', async () => {
    db.mockReturnValueOnce(mongoMocks.mockInsertBatch);
    const data = await wrapper.createBatch('', [{ test: 'test', _id: '' }]);
    expect(data).not.toEqual(undefined);
  });

  it('Test Update One', async () => {
    db.mockReturnValueOnce(mongoMocks.mockUpdateOne);
    const data = await wrapper.update('', { field: 'value' }, { $set: { test: 'test' } });
    expect(data).not.toEqual(undefined);
  });

  it('Test Update Batch', async () => {
    db.mockReturnValueOnce(mongoMocks.mockUpdateBatch);
    const data = await wrapper.updateBatch('', { field: 'value' }, { $set: { test: 'test' } });
    expect(data).not.toEqual(undefined);
  });
});
