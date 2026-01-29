import { Container, SqlQuerySpec } from '@azure/cosmos';
import { DocumentSpecificationRepository } from '../../../domain/repositories/document-specification.repository';
import { DocumentSpecificationCosmosModel } from '../models/document-specification-cosmos.model';
import { DocumentSpecification } from '../../../domain/entities/document-specification.entity';
import { ApplicationCode } from '../../../domain/value-objects/application-code.vo';
import { DocumentType } from '../../../domain/value-objects/document-type.vo';
import { DocumentGroup } from '../../../domain/value-objects/document-group.vo';
import { FileExtension } from '../../../domain/value-objects/file-extension.vo';

export class CosmosDocumentSpecificationRepository implements DocumentSpecificationRepository {
  private static readonly ENTITY_TYPE = 'DocumentSpecification';

  constructor(private readonly container: Container) {}

  async findByContext(
    applicationCode: ApplicationCode,
    documentType: DocumentType,
    documentGroup: DocumentGroup,
  ): Promise<DocumentSpecification | null> {
    const query: SqlQuerySpec = {
      query:
        'SELECT TOP 1 * FROM c WHERE c.entityType = @entityType AND c.codigo_aplicacion = @applicationCode AND c.tipo_archivo = @documentType AND c.grupo_documento = @documentGroup',
      parameters: [
        { name: '@entityType', value: CosmosDocumentSpecificationRepository.ENTITY_TYPE },
        { name: '@applicationCode', value: applicationCode.value },
        { name: '@documentType', value: documentType.value },
        { name: '@documentGroup', value: documentGroup.value },
      ],
    };

    const { resources } = await this.container.items
      .query<DocumentSpecificationCosmosModel>(query)
      .fetchAll();

    const resource = resources?.[0];
    return resource ? CosmosDocumentSpecificationRepository.toAggregate(resource) : null;
  }

  private static toAggregate(model: DocumentSpecificationCosmosModel): DocumentSpecification {
    const applicationCode = ApplicationCode.create(model.codigo_aplicacion);
    const documentType = DocumentType.create(model.tipo_archivo);
    const documentGroup = DocumentGroup.create(model.grupo_documento);
    const extensions = model.extensiones.map((value) => FileExtension.create(value));

    return DocumentSpecification.create(applicationCode, documentType, documentGroup, extensions);
  }
}
