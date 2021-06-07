import { startServer, stopServer } from '../../app/server';
import { createMockServer } from '../mocks/mockServer';

describe('Test Case Server', () => {
  it('Server Start init', async () => {
    const config = createMockServer();
    const app = await startServer(config);
    expect(app).not.toEqual(undefined);
    const spy = jest.spyOn(app, 'removeAllListeners');
    stopServer();
    expect(spy).toHaveBeenCalled();
  });
});
