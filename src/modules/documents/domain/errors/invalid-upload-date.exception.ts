import { DomainException } from './domain.exception';

export class InvalidUploadDateException extends DomainException {
  constructor(value: Date) {
    super(`Invalid upload date: ${value.toISOString?.() ?? value}`, 'DOCUMENT.INVALID_UPLOAD_DATE');
  }
}
