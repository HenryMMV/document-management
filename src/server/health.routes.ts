import { FastifyInstance, FastifyReply } from 'fastify';
import { HealthController } from '../modules/documents/presentation/http/health.controller';
import { HealthResponseSchema } from './swagger/base-schemas';

const controller = new HealthController();

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Service health check',
        response: {
          200: HealthResponseSchema,
        },
      },
    },
    async (_request, reply: FastifyReply) => {
      const response = await controller.check();
      return reply.status(response.status).send(response.body);
    },
  );
}
