export const DocumentSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'b52b3f05-f4f8-47a5-9adb-6b965c51eda1' },
    applicationCode: { type: 'string', example: 'CORE' },
    businessLine: { type: 'string', example: 'VIDA' },
    entity: { type: 'string', example: 'POLIZA' },
    documentCode: { type: 'string', example: 'DOC-20260129-0001' },
    issueYear: { type: 'integer', example: 2026 },
    issueMonth: { type: 'integer', minimum: 1, maximum: 12, example: 1 },
    issueDay: { type: 'integer', minimum: 1, maximum: 31, example: 29 },
    version: { type: 'string', example: 'v1' },
    fileName: { type: 'string', example: 'poliza-20260129.pdf' },
    blobPath: { type: 'string', example: 'vida/poliza/2026/01/29/poliza-20260129.pdf' },
    status: { type: 'string', enum: ['PENDING', 'REGISTERED', 'FAILED'] },
    extension: { type: 'string', example: 'pdf' },
    fileWeight: { type: 'number', example: 524288 },
    hash: { type: 'string', example: 'a3c2f5e4b9...' },
    uploadedBy: { type: 'string', example: 'analista123' },
    uploadedAt: { type: 'string', format: 'date-time', example: '2026-01-29T11:59:03.000Z' },
  },
  required: [
    'id',
    'applicationCode',
    'businessLine',
    'entity',
    'documentCode',
    'issueYear',
    'issueMonth',
    'issueDay',
    'version',
    'fileName',
    'blobPath',
    'status',
    'extension',
    'fileWeight',
    'hash',
    'uploadedBy',
    'uploadedAt',
  ],
  additionalProperties: false,
} as const;

export const DocumentResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', const: true },
    data: DocumentSchema,
  },
  required: ['success', 'data'],
  additionalProperties: false,
} as const;

export const ErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', const: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'DOCUMENT.ALREADY_REGISTERED' },
        message: { type: 'string', example: 'Document already registered: DOC-20260129-0001' },
      },
      required: ['code', 'message'],
      additionalProperties: false,
    },
  },
  required: ['success', 'error'],
  additionalProperties: false,
} as const;

export const SaveDocumentRequestSchema = {
  type: 'object',
  properties: {
    lineadenegocio: { type: 'string' },
    entidad: { type: 'string' },
    anio: { type: 'integer' },
    mes: { type: 'integer', minimum: 1, maximum: 12 },
    dia: { type: 'integer', minimum: 1, maximum: 31 },
    id_identidad: { type: 'string' },
    extension: { type: 'string' },
    usuario: { type: 'string' },
    aplicacion: { type: 'string' },
    documetBase64: { type: 'string', description: 'Contenido del documento en Base64' },
  },
  required: [
    'lineadenegocio',
    'entidad',
    'anio',
    'mes',
    'dia',
    'id_identidad',
    'extension',
    'usuario',
    'aplicacion',
    'documetBase64',
  ],
  additionalProperties: false,
} as const;
