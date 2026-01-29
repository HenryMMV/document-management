import { DomainException } from './domain.exception';

export class InvalidDocumentIssueDateException extends DomainException {
  constructor(year: number, month: number, day: number) {
    super(`Invalid document issue date: ${year}-${month}-${day}`, 'DOCUMENT.INVALID_ISSUE_DATE');
  }
}
