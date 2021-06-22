import { startServer, stopServer } from '../../app/server';
import { createMockServer } from '../mocks/mockServer';

jest.mock('koa');
jest.mock('dotenv');

describe('Test Case Server', () => {
  it('Server Start and Stop', () => {
    const config = createMockServer();
    const app = startServer(config);
    const spy = jest.spyOn(app, 'removeAllListeners');
    stopServer();
    expect(app).not.toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });
});
