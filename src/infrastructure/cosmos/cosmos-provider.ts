import { CosmosClient, Container, Database } from '@azure/cosmos';
import { Agent, fetch } from 'undici';
import { env } from '../../config/env';

interface ContainerOptions {
  id: string;
  partitionKey: string;
}

export class CosmosProvider {
  private constructor(
    private readonly client: CosmosClient,
    private readonly databasePromise: Promise<Database>,
  ) {}

  static async create(): Promise<CosmosProvider> {
    const key = await CosmosProvider.resolveKey();

    const client = new CosmosClient({
      endpoint: env.cosmos.endpoint,
      key,
    });

    const databasePromise = CosmosProvider.ensureDatabase(client, env.cosmos.database);

    return new CosmosProvider(client, databasePromise);
  }

  async getDocumentRegistrationContainer(): Promise<Container> {
    return this.ensureContainer({
      id: env.cosmos.containerDocuments,
      partitionKey: '/aplicacion',
    });
  }

  async getDocumentSpecificationContainer(): Promise<Container> {
    return this.ensureContainer({
      id: env.cosmos.containerSpecifications,
      partitionKey: '/codigo_aplicacion',
    });
  }

  private static async ensureDatabase(client: CosmosClient, databaseId: string): Promise<Database> {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    return database;
  }

  private async ensureContainer(options: ContainerOptions): Promise<Container> {
    const database = await this.databasePromise;
    const { container } = await database.containers.createIfNotExists({
      id: options.id,
      partitionKey: {
        paths: [options.partitionKey],
      },
      defaultTtl: -1,
    });
    return container;
  }

  private static async resolveKey(): Promise<string> {
    if (env.cosmos.key) {
      return env.cosmos.key;
    }

    if (!env.cosmos.discoverKeys) {
      throw new Error('Cosmos primary key is not configured. Set COSMOS_KEY or enable COSMOS_DISCOVER_KEYS.');
    }

    if (!env.cosmos.discoveryUrl) {
      throw new Error('COSMOS_DISCOVERY_URL must be provided when COSMOS_DISCOVER_KEYS is enabled.');
    }

    const dispatcher = new Agent({
      connect: {
        rejectUnauthorized: !env.cosmos.allowSelfSigned,
      },
    });

    const response = await fetch(env.cosmos.discoveryUrl, { dispatcher });
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve Cosmos emulator keys from ${env.cosmos.discoveryUrl}: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const key = CosmosProvider.extractPrimaryKey(payload);
    if (!key) {
      throw new Error('Unable to extract primary key from Cosmos emulator discovery response.');
    }

    return key;
  }

  private static extractPrimaryKey(payload: Record<string, unknown>): string | undefined {
    const candidates: Array<unknown> = [
      payload?.['masterKey'],
      payload?.['primaryMasterKey'],
      payload?.['documents'] && (payload['documents'] as Record<string, unknown>)['primaryMasterKey'],
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.length > 0) {
        return candidate;
      }
    }

    return undefined;
  }
}
