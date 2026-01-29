import { DomainException } from './domain.exception';

export class DocumentAlreadyRegisteredException extends DomainException {
  constructor(documentCode: string) {
    super(`Document already registered: ${documentCode}`, 'DOCUMENT.ALREADY_REGISTERED');
  }
}
