import { DomainException } from './domain.exception';

export class InvalidDocumentGroupException extends DomainException {
  constructor(group: string) {
    super(`Invalid document group: ${group}`, 'DOCUMENT.INVALID_DOCUMENT_GROUP');
  }
}
