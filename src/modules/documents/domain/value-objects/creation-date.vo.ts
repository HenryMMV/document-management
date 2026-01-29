import { InvalidCreationDateException } from '../errors/invalid-creation-date.exception';
import { ValueObject } from './value-object';

interface CreationDateProps {
  value: Date;
}

export class CreationDate extends ValueObject<CreationDateProps> {
  private constructor(props: CreationDateProps) {
    super(props);
  }

  static create(raw: Date): CreationDate {
    if (!raw || Number.isNaN(raw.getTime())) {
      throw new InvalidCreationDateException(raw as Date);
    }
    const now = new Date();
    if (raw.getTime() - now.getTime() > 60 * 1000) {
      throw new InvalidCreationDateException(raw);
    }
    return new CreationDate({ value: new Date(raw) });
  }

  get value(): Date {
    return new Date(this.props.value);
  }
}
