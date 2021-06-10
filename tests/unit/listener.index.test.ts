import { useListeners } from '../../app/listeners';
import { createPool } from '../../app/utils/broker';
import { createMockListener, createMockLogger, createMockPool } from '../mocks';

jest.mock('../../app/utils/broker');

describe('Test Cases Listeners Broker', () => {
  it('Test listener config empty pool', () => {
    const pool = useListeners({ options: {}, log: createMockLogger });
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