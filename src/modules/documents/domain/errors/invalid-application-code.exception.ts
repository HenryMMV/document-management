import { DomainException } from './domain.exception';

export class InvalidApplicationCodeException extends DomainException {
  constructor(code: string) {
    super(`Invalid application code: ${code}`, 'DOCUMENT.INVALID_APPLICATION_CODE');
  }
}
