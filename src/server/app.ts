import Fastify, { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from '../config/env';
import { createDocumentModule } from '../modules/documents/document.module';
import { registerDocumentRoutes } from '../modules/documents/presentation/http/document.routes';
import { registerHealthRoutes } from './health.routes';
import { ErrorSchema } from './swagger/base-schemas';

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.logLevel,
    },
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Gestor Documental API',
        description: 'CQRS-based document management service',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:' + env.port,
          description: 'Local environment',
        },
      ],
      tags: [
        { name: 'Documents', description: 'Operations over document registrations' },
        { name: 'Health', description: 'Service status endpoints' },
      ],
      components: {
        schemas: {
          ErrorEnvelope: ErrorSchema,
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  const documentModule = await createDocumentModule();
  await registerDocumentRoutes(app, { controller: documentModule.controller });
  await registerHealthRoutes(app);

  await app.ready();
  return app;
}
