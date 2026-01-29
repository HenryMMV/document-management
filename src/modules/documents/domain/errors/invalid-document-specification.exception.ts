import { DomainException } from './domain.exception';

export class InvalidDocumentSpecificationException extends DomainException {
  constructor(details: string) {
    super(`Invalid document specification: ${details}`, 'DOCUMENT.INVALID_SPECIFICATION');
  }
}
