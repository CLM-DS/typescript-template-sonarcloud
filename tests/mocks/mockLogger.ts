jest.mock('pino');

import Pino from 'pino';

const createMockLogger = Pino as jest.Mocked<typeof Pino> as unknown as Pino.Logger;

createMockLogger.info = jest.fn();
createMockLogger.warn = jest.fn();
createMockLogger.error = jest.fn();

export { createMockLogger };
