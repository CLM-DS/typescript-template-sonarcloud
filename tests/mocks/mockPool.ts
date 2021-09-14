export const createMockPool = (publish: boolean) => ({
  getBroker: jest.fn(() => ({
    producer: {
      publish: jest.fn(() => (publish ? Promise.resolve() : Promise.reject(new Error('Publish error')))),
    },
    consumer: {
      addListener: jest.fn(),
    },
    check: jest.fn(),
    setError: jest.fn(),
    haveError: () => !publish,
  })),
  addBroker: jest.fn(),
  map: jest.fn(),
  setError: jest.fn(),
  haveError: jest.fn(),
});
