export default {
  type: 'object',
  properties: {
    from: { type: 'string' },
    to: { type: 'string' },
  },
  required: ['from', 'to'],
} as const;
