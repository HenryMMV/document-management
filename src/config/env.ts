import dotenv from 'dotenv';

dotenv.config();

type CosmosConfig = {
  endpoint: string;
  key?: string;
  database: string;
  containerDocuments: string;
  containerSpecifications: string;
  allowSelfSigned: boolean;
  discoverKeys: boolean;
  discoveryUrl?: string;
};

type DocumentsConfig = {
  useInMemoryRepositories: boolean;
};

type AppConfig = {
  port: number;
  logLevel: 'info' | 'warn' | 'error' | 'debug';
  cosmos: CosmosConfig;
  documents: DocumentsConfig;
};

interface CosmosConnectionString {
  endpoint?: string;
  key?: string;
}

function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function parsePort(value: string | undefined): number {
  const parsed = Number(value ?? '3000');
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid port value: ${value}`);
  }
  return parsed;
}

function getLogLevel(value: string | undefined): AppConfig['logLevel'] {
  const normalized = (value ?? 'info').toLowerCase();
  switch (normalized) {
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
      return normalized as AppConfig['logLevel'];
    default:
      return 'info';
  }
}

function optional(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseCosmosConnectionString(value: string | undefined): CosmosConnectionString {
  if (!value) {
    return {};
  }

  const segments = value
    .split(';')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  const map = new Map<string, string>();
  for (const segment of segments) {
    const [rawKey, ...rest] = segment.split('=');
    if (!rawKey || rest.length === 0) {
      continue;
    }
    map.set(rawKey.toLowerCase(), rest.join('='));
  }

  return {
    endpoint: map.get('accountendpoint'),
    key: map.get('accountkey'),
  };
}

const allowSelfSigned = (process.env.COSMOS_ALLOW_SELF_SIGNED ?? 'false').toLowerCase() === 'true';
if (allowSelfSigned) {
  // Cosmos emulator uses a self-signed certificate; this opts-in explicitly for local usage.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const parsedConnection = parseCosmosConnectionString(optional(process.env.COSMOS_CONNECTION_STRING));
const cosmosEndpoint = optional(process.env.COSMOS_ENDPOINT) ?? parsedConnection.endpoint;
if (!cosmosEndpoint) {
  throw new Error('COSMOS_ENDPOINT or AccountEndpoint in COSMOS_CONNECTION_STRING is required.');
}

const cosmosKey = optional(process.env.COSMOS_KEY) ?? parsedConnection.key;
const discoverKeys = (process.env.COSMOS_DISCOVER_KEYS ?? 'false').toLowerCase() === 'true';
const sanitizedEndpoint = cosmosEndpoint.endsWith('/') ? cosmosEndpoint.slice(0, -1) : cosmosEndpoint;
const cosmosDiscoveryUrl =
  optional(process.env.COSMOS_DISCOVERY_URL) ?? `${sanitizedEndpoint}/_explorer/emulator.json`;

if (!cosmosKey && !discoverKeys) {
  throw new Error('COSMOS_KEY is required when key discovery is disabled.');
}

export const env: AppConfig = {
  port: parsePort(process.env.PORT),
  logLevel: getLogLevel(process.env.LOG_LEVEL),
  cosmos: {
    endpoint: cosmosEndpoint,
    key: cosmosKey,
    database: requireEnv('COSMOS_DATABASE'),
    containerDocuments: requireEnv('COSMOS_CONTAINER_DOCUMENTS', 'document-registrations'),
    containerSpecifications: requireEnv('COSMOS_CONTAINER_SPECIFICATIONS', 'document-specifications'),
    allowSelfSigned,
    discoverKeys,
    discoveryUrl: cosmosDiscoveryUrl,
  },
  documents: {
    useInMemoryRepositories: (process.env.DOCUMENTS_USE_INMEMORY ?? 'false').toLowerCase() === 'true',
  },
};
