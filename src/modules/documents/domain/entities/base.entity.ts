import { DocumentId } from '../value-objects/document-id.vo';

export abstract class BaseEntity {
  protected constructor(protected readonly id: DocumentId) {}

  getId(): DocumentId {
    return this.id;
  }
}
