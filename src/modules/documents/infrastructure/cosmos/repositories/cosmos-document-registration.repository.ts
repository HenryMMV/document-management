import { Container, SqlQuerySpec } from '@azure/cosmos';
import { DocumentRegistrationRepository } from '../../../domain/repositories/document-registration.repository';
import {
  DocumentRegistration,
  DocumentRegistrationSnapshot,
} from '../../../domain/aggregates/document-registration.aggregate';
import { DocumentId } from '../../../domain/value-objects/document-id.vo';
import { ApplicationCode } from '../../../domain/value-objects/application-code.vo';
import { DocumentCode } from '../../../domain/value-objects/document-code.vo';
import { DocumentRegistrationCosmosModel } from '../models/document-registration-cosmos.model';

export class CosmosDocumentRegistrationRepository implements DocumentRegistrationRepository {
  private static readonly ENTITY_TYPE = 'DocumentRegistration';

  constructor(private readonly container: Container) {}

  async save(document: DocumentRegistration): Promise<void> {
    const model = CosmosDocumentRegistrationRepository.toModel(document);
    await this.container.items.upsert<DocumentRegistrationCosmosModel>(model);
  }

  async findById(id: DocumentId): Promise<DocumentRegistration | null> {
    const query: SqlQuerySpec = {
      query: 'SELECT TOP 1 * FROM c WHERE c.id = @id AND c.entityType = @entityType',
      parameters: [
        { name: '@id', value: id.value },
        { name: '@entityType', value: CosmosDocumentRegistrationRepository.ENTITY_TYPE },
      ],
    };

    const { resources } = await this.container.items
      .query<DocumentRegistrationCosmosModel>(query)
      .fetchAll();

    const resource = resources?.[0];
    return resource ? CosmosDocumentRegistrationRepository.toAggregate(resource) : null;
  }

  async findByCode(
    applicationCode: ApplicationCode,
    documentCode: DocumentCode,
  ): Promise<DocumentRegistration | null> {
    const query: SqlQuerySpec = {
      query:
        'SELECT TOP 1 * FROM c WHERE c.entityType = @entityType AND c.aplicacion = @applicationCode AND c.id_identidad = @documentCode',
      parameters: [
        { name: '@entityType', value: CosmosDocumentRegistrationRepository.ENTITY_TYPE },
        { name: '@applicationCode', value: applicationCode.value },
        { name: '@documentCode', value: documentCode.value },
      ],
    };

    const { resources } = await this.container.items
      .query<DocumentRegistrationCosmosModel>(query)
      .fetchAll();

    const resource = resources?.[0];
    return resource ? CosmosDocumentRegistrationRepository.toAggregate(resource) : null;
  }

  async exists(documentCode: DocumentCode): Promise<boolean> {
    const query: SqlQuerySpec = {
      query: 'SELECT VALUE 1 FROM c WHERE c.entityType = @entityType AND c.id_identidad = @documentCode',
      parameters: [
        { name: '@entityType', value: CosmosDocumentRegistrationRepository.ENTITY_TYPE },
        { name: '@documentCode', value: documentCode.value },
      ],
    };

    const { resources } = await this.container.items
      .query<number>(query)
      .fetchAll();

    return Boolean(resources && resources.length > 0);
  }

  private static toModel(document: DocumentRegistration): DocumentRegistrationCosmosModel {
    const snapshot = document.toSnapshot();
    return {
      ...snapshot,
      entityType: CosmosDocumentRegistrationRepository.ENTITY_TYPE,
    };
  }

  private static toAggregate(model: DocumentRegistrationCosmosModel): DocumentRegistration {
    const snapshot: DocumentRegistrationSnapshot = {
      id: model.id,
      lineadenegocio: model.lineadenegocio,
      entidad: model.entidad,
      anio: model.anio,
      mes: model.mes,
      dia: model.dia,
      id_identidad: model.id_identidad,
      version: model.version,
      nombreArchivo: model.nombreArchivo,
      blobPath: model.blobPath,
      estado: model.estado,
      extension: model.extension,
      tamanoBytes: model.tamanoBytes,
      hash: model.hash,
      usuario: model.usuario,
      fechaSubida: model.fechaSubida,
      aplicacion: model.aplicacion,
    };

    return DocumentRegistration.restore(snapshot);
  }
}
