import { DomainException } from './domain.exception';

export class InvalidDocumentUploaderException extends DomainException {
  constructor(uploader: string) {
    super(`Invalid document uploader: ${uploader}`, 'DOCUMENT.INVALID_UPLOADER');
  }
}
