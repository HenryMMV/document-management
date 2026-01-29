import { DomainException } from './domain.exception';

export class DocumentSpecificationMismatchException extends DomainException {
  constructor(reason: string) {
    super(`Document specification mismatch: ${reason}`, 'DOCUMENT.SPECIFICATION_MISMATCH');
  }
}
