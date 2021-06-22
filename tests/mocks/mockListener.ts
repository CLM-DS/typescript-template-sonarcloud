import { createMockLogger } from './mockLogger';

export const createMockListener = {
  log: createMockLogger,
  options: {
    brokerConfig: {
      kafkaConsumer: {
        type: 'kafka' as const,
      },
    },
  },
};
