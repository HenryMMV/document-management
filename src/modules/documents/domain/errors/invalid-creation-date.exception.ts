import { DomainException } from './domain.exception';

export class InvalidCreationDateException extends DomainException {
  constructor(date: Date) {
    super(
      `Invalid creation date: ${date?.toISOString?.() ?? 'undefined'}`,
      'DOCUMENT.INVALID_CREATION_DATE',
    );
  }
}
