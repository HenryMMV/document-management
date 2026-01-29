import { DomainException } from './domain.exception';

export class InvalidDocumentCodeException extends DomainException {
  constructor(code: string) {
    super(`Invalid document code: ${code}`, 'DOCUMENT.INVALID_DOCUMENT_CODE');
  }
}
