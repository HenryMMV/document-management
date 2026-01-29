import { DomainException } from './domain.exception';

export class InvalidDocumentStatusTransitionException extends DomainException {
  constructor(current: string, next: string) {
    super(
      `Invalid status transition from ${current} to ${next}`,
      'DOCUMENT.INVALID_STATUS_TRANSITION',
    );
  }
}
