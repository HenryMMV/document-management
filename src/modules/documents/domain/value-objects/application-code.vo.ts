import { InvalidApplicationCodeException } from '../errors/invalid-application-code.exception';
import { ValueObject } from './value-object';

interface ApplicationCodeProps {
  value: string;
}

export class ApplicationCode extends ValueObject<ApplicationCodeProps> {
  private constructor(props: ApplicationCodeProps) {
    super(props);
  }

  static create(raw: string): ApplicationCode {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidApplicationCodeException(raw ?? '');
    }
    if (!/^[A-Z0-9_-]+$/i.test(value)) {
      throw new InvalidApplicationCodeException(value);
    }
    return new ApplicationCode({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
