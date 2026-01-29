import { DocumentSpecification } from '../entities/document-specification.entity';
import { ApplicationCode } from '../value-objects/application-code.vo';
import { DocumentGroup } from '../value-objects/document-group.vo';
import { DocumentType } from '../value-objects/document-type.vo';

export interface DocumentSpecificationRepository {
  findByContext(
    applicationCode: ApplicationCode,
    documentType: DocumentType,
    documentGroup: DocumentGroup,
  ): Promise<DocumentSpecification | null>;
}
