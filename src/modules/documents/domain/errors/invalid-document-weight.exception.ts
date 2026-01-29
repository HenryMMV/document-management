import { DomainException } from './domain.exception';

export class InvalidDocumentWeightException extends DomainException {
  constructor(weight: number) {
    super(`Invalid document weight: ${weight}`, 'DOCUMENT.INVALID_DOCUMENT_WEIGHT');
  }
}
