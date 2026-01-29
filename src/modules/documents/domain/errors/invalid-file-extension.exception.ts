import { DomainException } from './domain.exception';

export class InvalidFileExtensionException extends DomainException {
  constructor(extension: string) {
    super(`Invalid file extension: ${extension}`, 'DOCUMENT.INVALID_FILE_EXTENSION');
  }
}
