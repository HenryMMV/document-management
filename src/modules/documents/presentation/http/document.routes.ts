import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DocumentController } from './document.controller';
import { HttpRequest } from './http-request';
import { DocumentDto } from '../../application/dtos/document.dto';
import {
  DocumentResponseSchema,
  ErrorResponseSchema,
  SaveDocumentRequestSchema,
} from './swagger-schemas';

interface SaveDocumentBody {
  lineadenegocio?: string;
  entidad?: string;
  anio?: number;
  mes?: number;
  dia?: number;
  id_identidad?: string;
  extension?: string;
  usuario?: string;
  aplicacion?: string;
  documetBase64?: string;
}

interface GetDocumentQueryString {
  applicationCode?: string;
  documentCode?: string;
}

interface DocumentRoutesDeps {
  controller: DocumentController;
}

export async function registerDocumentRoutes(app: FastifyInstance, deps: DocumentRoutesDeps): Promise<void> {
  const { controller } = deps;

  app.post(
    '/document/save',
    {
      schema: {
        tags: ['Documents'],
        summary: 'Register a new document',
        description: 'Executes the SaveDocumentCommand to persist a document registration.',
        body: SaveDocumentRequestSchema,
        response: {
          201: DocumentResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Body: SaveDocumentBody }>, reply: FastifyReply) => {
      const httpRequest: HttpRequest<SaveDocumentBody> = { body: request.body };
      const response = await controller.saveDocument(httpRequest);
      return reply.status(response.status).send(response.body);
    },
  );

  app.get(
    '/document',
    {
      schema: {
        tags: ['Documents'],
        summary: 'Retrieve a document',
        description: 'Executes the GetDocumentQuery to obtain a document projection.',
        querystring: {
          type: 'object',
          required: ['applicationCode', 'documentCode'],
          properties: {
            applicationCode: { type: 'string', description: 'Application identifier', example: 'CORE' },
            documentCode: { type: 'string', description: 'Document code', example: 'DOC-20260129-0001' },
          },
        },
        response: {
          200: DocumentResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: GetDocumentQueryString }>, reply: FastifyReply) => {
      const httpRequest: HttpRequest<unknown, GetDocumentQueryString> = { query: request.query };
      const response = await controller.getDocument(httpRequest);
      return reply.status(response.status).send(response.body);
    },
  );
}
