import { DocumentRegistration } from '../aggregates/document-registration.aggregate';
import { ApplicationCode } from '../value-objects/application-code.vo';
import { DocumentCode } from '../value-objects/document-code.vo';
import { DocumentId } from '../value-objects/document-id.vo';

export interface DocumentRegistrationRepository {
  save(document: DocumentRegistration): Promise<void>;
  findById(id: DocumentId): Promise<DocumentRegistration | null>;
  findByCode(
    applicationCode: ApplicationCode,
    documentCode: DocumentCode,
  ): Promise<DocumentRegistration | null>;
  exists(documentCode: DocumentCode): Promise<boolean>;
}
