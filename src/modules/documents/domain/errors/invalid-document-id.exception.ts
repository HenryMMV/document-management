import { DomainException } from './domain.exception';

export class InvalidDocumentIdException extends DomainException {
  constructor(id: string) {
    super(`Invalid document identifier: ${id}`, 'DOCUMENT.INVALID_DOCUMENT_ID');
  }
}
