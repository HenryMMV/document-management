export const HealthResponseSchema: Record<string, unknown> = {
  type: 'object',
  properties: {
    success: { type: 'boolean', enum: [true] },
    data: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ok'], example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
      },
      required: ['status', 'timestamp'],
      additionalProperties: false,
    },
  },
  required: ['success', 'data'],
  additionalProperties: false,
};

export const ErrorSchema: Record<string, unknown> = {
  $id: 'ErrorEnvelope',
  type: 'object',
  properties: {
    success: { type: 'boolean', enum: [false] },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['code', 'message'],
      additionalProperties: false,
    },
  },
  required: ['success', 'error'],
  additionalProperties: false,
};
