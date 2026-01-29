import { InvalidUploadDateException } from '../errors/invalid-upload-date.exception';
import { ValueObject } from './value-object';

interface UploadDateProps {
  value: Date;
}

export class UploadDate extends ValueObject<UploadDateProps> {
  private constructor(props: UploadDateProps) {
    super(props);
  }

  static create(raw: Date): UploadDate {
    if (!raw || Number.isNaN(raw.getTime())) {
      throw new InvalidUploadDateException(raw as Date);
    }

    const now = new Date();
    if (raw.getTime() - now.getTime() > 5 * 60 * 1000) {
      throw new InvalidUploadDateException(raw);
    }

    return new UploadDate({ value: new Date(raw) });
  }

  get value(): Date {
    return new Date(this.props.value);
  }

  toISOString(): string {
    return this.props.value.toISOString();
  }
}
