import { DocumentSpecification } from '../../domain/entities/document-specification.entity';
import { DocumentSpecificationRepository } from '../../domain/repositories/document-specification.repository';
import { ApplicationCode } from '../../domain/value-objects/application-code.vo';
import { DocumentType } from '../../domain/value-objects/document-type.vo';
import { DocumentGroup } from '../../domain/value-objects/document-group.vo';

function compositeKey(applicationCode: string, documentType: string, documentGroup: string): string {
  return `${applicationCode.toUpperCase()}::${documentType.toUpperCase()}::${documentGroup.toUpperCase()}`;
}

export class InMemoryDocumentSpecificationRepository implements DocumentSpecificationRepository {
  private readonly specifications = new Map<string, DocumentSpecification>();

  constructor(initialSpecifications: DocumentSpecification[] = []) {
    initialSpecifications.forEach((specification) => this.add(specification));
  }

  async findByContext(
    applicationCode: ApplicationCode,
    documentType: DocumentType,
    documentGroup: DocumentGroup,
  ): Promise<DocumentSpecification | null> {
    const key = compositeKey(applicationCode.value, documentType.value, documentGroup.value);
    return this.specifications.get(key) ?? null;
  }

  add(specification: DocumentSpecification): void {
    const key = compositeKey(
      specification.applicationCode.value,
      specification.documentType.value,
      specification.documentGroup.value,
    );
    this.specifications.set(key, specification);
  }
}
