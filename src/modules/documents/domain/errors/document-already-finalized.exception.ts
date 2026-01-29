import { DomainException } from './domain.exception';

export class DocumentAlreadyFinalizedException extends DomainException {
  constructor(documentCode: string) {
    super(`Document already finalized: ${documentCode}`, 'DOCUMENT.ALREADY_FINALIZED');
  }
}
