import { DomainException } from './domain.exception';

export class DocumentRegistrationNotFoundException extends DomainException {
  constructor(documentCode: string) {
    super(`Document registration not found for code: ${documentCode}`, 'DOCUMENT.REGISTRATION_NOT_FOUND');
  }
}
