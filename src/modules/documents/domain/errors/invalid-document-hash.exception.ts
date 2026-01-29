import { DomainException } from './domain.exception';

export class InvalidDocumentHashException extends DomainException {
  constructor(hash: string) {
    super(`Invalid document hash: ${hash}`, 'DOCUMENT.INVALID_HASH');
  }
}
