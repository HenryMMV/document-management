import { DomainException } from './domain.exception';

export class InvalidDocumentVersionException extends DomainException {
  constructor(version: string) {
    super(`Invalid document version: ${version}`, 'DOCUMENT.INVALID_VERSION');
  }
}
