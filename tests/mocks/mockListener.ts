import { createMockLogger } from '.';

export const createMockListener = {
  log: createMockLogger,
  options: {
    brokerConfig: {
      kafkaConsumer: {
        type: 'kafka' as const
      },
    },
  },
};