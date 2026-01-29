import { DomainException } from './domain.exception';

export class InvalidDocumentTypeException extends DomainException {
  constructor(type: string) {
    super(`Invalid document type: ${type}`, 'DOCUMENT.INVALID_DOCUMENT_TYPE');
  }
}
