import { createLogger } from '../../app/utils/logger';

export const createMockListener = {
  log: createLogger(),
  options: {
    brokerConfig: {
      kafkaConsumer: {
        type: 'kafka' as const
      },
    },
  },
};
