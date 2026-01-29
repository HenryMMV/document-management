import { DomainException } from './domain.exception';

export class InvalidDocumentFileNameException extends DomainException {
  constructor(fileName: string) {
    super(`Invalid document file name: ${fileName}`, 'DOCUMENT.INVALID_FILE_NAME');
  }
}
