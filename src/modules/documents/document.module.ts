import { env } from '../../config/env';
import { CosmosProvider } from '../../infrastructure/cosmos/cosmos-provider';
import { CosmosDocumentRegistrationRepository } from './infrastructure/cosmos/repositories/cosmos-document-registration.repository';
import { CosmosDocumentSpecificationRepository } from './infrastructure/cosmos/repositories/cosmos-document-specification.repository';
import { InMemoryDocumentRegistrationRepository } from './infrastructure/memory/in-memory-document-registration.repository';
import { InMemoryDocumentSpecificationRepository } from './infrastructure/memory/in-memory-document-specification.repository';
import { DocumentSpecification } from './domain/entities/document-specification.entity';
import { DocumentRegistrationRepository } from './domain/repositories/document-registration.repository';
import { DocumentSpecificationRepository } from './domain/repositories/document-specification.repository';
import { ApplicationCode } from './domain/value-objects/application-code.vo';
import { DocumentType } from './domain/value-objects/document-type.vo';
import { DocumentGroup } from './domain/value-objects/document-group.vo';
import { FileExtension } from './domain/value-objects/file-extension.vo';
import { SaveDocumentCommandHandler } from './application/commands/save-document/save-document.handler';
import { GetDocumentQueryHandler } from './application/queries/get-document/get-document.handler';
import { DocumentController } from './presentation/http/document.controller';

export interface DocumentModule {
  controller: DocumentController;
}

export async function createDocumentModule(): Promise<DocumentModule> {
  if (env.documents.useInMemoryRepositories) {
    return createInMemoryModule(false);
  }

  try {
    return await createCosmosModule();
  } catch (error) {
    // eslint-disable-next-line no-console -- intentional diagnostic for operators
    console.error('Failed to initialize Cosmos repositories', error);
    return createInMemoryModule(true);
  }
}

async function createCosmosModule(): Promise<DocumentModule> {
  const cosmosProvider = await CosmosProvider.create();
  const documentContainer = await cosmosProvider.getDocumentRegistrationContainer();
  const specificationContainer = await cosmosProvider.getDocumentSpecificationContainer();

  const documentRepository = new CosmosDocumentRegistrationRepository(documentContainer);
  const specificationRepository = new CosmosDocumentSpecificationRepository(specificationContainer);

  return buildModule(documentRepository, specificationRepository);
}

function createInMemoryModule(fallback: boolean): DocumentModule {
  if (fallback) {
    // eslint-disable-next-line no-console -- intentional diagnostic for operators
    console.warn('Using in-memory repositories due to Cosmos connectivity issues.');
  }

  const specificationRepository = new InMemoryDocumentSpecificationRepository(buildDefaultSpecifications());
  const documentRepository = new InMemoryDocumentRegistrationRepository();

  return buildModule(documentRepository, specificationRepository);
}

function buildModule(
  documentRepository: DocumentRegistrationRepository,
  specificationRepository: DocumentSpecificationRepository,
): DocumentModule {
  const saveHandler = new SaveDocumentCommandHandler(documentRepository, specificationRepository);
  const getHandler = new GetDocumentQueryHandler(documentRepository);

  const controller = new DocumentController(saveHandler, getHandler);

  return { controller };
}

function buildDefaultSpecifications(): DocumentSpecification[] {
  try {
    const application = ApplicationCode.create('CORE');
    const type = DocumentType.create('PDF');
    const group = DocumentGroup.create('CONTRACTS');
    const extensions = [FileExtension.create('pdf'), FileExtension.create('jpeg')];

    return [DocumentSpecification.create(application, type, group, extensions)];
  } catch (error) {
    // eslint-disable-next-line no-console -- fallback should never break boot sequence
    console.error('Failed to build default in-memory document specifications', error);
    return [];
  }
}
