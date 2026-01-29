import { DomainException } from './domain.exception';

export class InvalidBlobPathException extends DomainException {
  constructor(path: string) {
    super(`Invalid blob path: ${path}`, 'DOCUMENT.INVALID_BLOB_PATH');
  }
}
