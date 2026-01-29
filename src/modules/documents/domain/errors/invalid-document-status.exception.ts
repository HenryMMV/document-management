import { DomainException } from './domain.exception';

export class InvalidDocumentStatusException extends DomainException {
  constructor(status: string) {
    super(`Invalid document status: ${status}`, 'DOCUMENT.INVALID_STATUS');
  }
}
