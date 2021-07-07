import { useListeners } from '../../app/listeners';
import { createBroker, createPool } from '../../app/utils/broker';
import { createMockListener, createMockLogger, createMockPool } from '../mocks';

jest.mock('../../app/utils/broker');

describe('Test Cases Listeners Broker', () => {
  it('Test listener config empty pool', () => {
    const pool = useListeners({ options: {}, log: createMockLogger });
    expect(pool).not.toBeDefined();
  });

  it('test listener config simple pool', () => {
    const poolMock = createMockPool(true);
    const createPoolMock = createPool as jest.MockedFunction<typeof createPool>;
    const createBrokerMock = createBroker as jest.MockedFunction<typeof createBroker>;
    createPoolMock.mockReturnValueOnce(poolMock);
    createBrokerMock.mockReturnValueOnce(poolMock.getBroker());
    const pool = useListeners(createMockListener);
    expect(pool).toBeDefined();
  });
});
