export const messageMock = {
  topic: 'test',
  partition: 0,
  message: {
    key: Buffer.from('message tiny', 'utf-8'),
    value: Buffer.from('message tiny', 'utf-8'),
    timestamp: '',
    size: 0,
    attributes: 1,
    offset: '',
    headers: { channel: '', country: '' },
  },
};
