import { buildServer } from './server/app';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await buildServer();

  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`HTTP server running on port ${env.port}`);
  } catch (error) {
    app.log.error(error, 'Failed to start HTTP server');
    process.exit(1);
  }
}

bootstrap();
