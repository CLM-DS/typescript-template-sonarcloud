import { useListeners } from '../../app/listeners';
import { createPool } from '../../app/utils/broker';
import { createLogger } from '../../app/utils/logger';
import { createMockListener, createMockPool } from '../mocks';

jest.mock('../../app/utils/broker');

describe('Test Cases Listeners Broker', () => {
  it('Test listener config empty pool', () => {
    const pool = useListeners({ options: {}, log: createLogger() });
    expect(pool).not.toBeDefined();
  });

  it('test listener config simple pool', () => {
    const createPoolMock = createPool as jest.MockedFunction<typeof createPool>;
    const poolMock = createMockPool(true);
    createPoolMock.mockReturnValueOnce(poolMock);
    const pool = useListeners(createMockListener);
    expect(pool).toBeDefined();
  });
});