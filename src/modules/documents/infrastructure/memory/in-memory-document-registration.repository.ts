import { DocumentRegistration } from '../../domain/aggregates/document-registration.aggregate';
import { DocumentRegistrationRepository } from '../../domain/repositories/document-registration.repository';
import { ApplicationCode } from '../../domain/value-objects/application-code.vo';
import { DocumentCode } from '../../domain/value-objects/document-code.vo';
import { DocumentId } from '../../domain/value-objects/document-id.vo';
import { DocumentRegistrationSnapshot } from '../../domain/aggregates/document-registration.aggregate';

function compositeKey(applicationCode: string, documentCode: string): string {
  return `${applicationCode.toUpperCase()}::${documentCode.toUpperCase()}`;
}

export class InMemoryDocumentRegistrationRepository implements DocumentRegistrationRepository {
  private readonly byId = new Map<string, DocumentRegistrationSnapshot>();
  private readonly byCompositeKey = new Map<string, DocumentRegistrationSnapshot>();

  async save(document: DocumentRegistration): Promise<void> {
    const snapshot = document.toSnapshot();
    this.byId.set(snapshot.id, snapshot);
    this.byCompositeKey.set(compositeKey(snapshot.aplicacion, snapshot.id_identidad), snapshot);
  }

  async findById(id: DocumentId): Promise<DocumentRegistration | null> {
    const snapshot = this.byId.get(id.value);
    return snapshot ? DocumentRegistration.restore(snapshot) : null;
  }

  async findByCode(
    applicationCode: ApplicationCode,
    documentCode: DocumentCode,
  ): Promise<DocumentRegistration | null> {
    const snapshot = this.byCompositeKey.get(compositeKey(applicationCode.value, documentCode.value));
    return snapshot ? DocumentRegistration.restore(snapshot) : null;
  }

  async exists(documentCode: DocumentCode): Promise<boolean> {
    for (const snapshot of this.byCompositeKey.values()) {
      if (snapshot.id_identidad === documentCode.value) {
        return true;
      }
    }
    return false;
  }
}
