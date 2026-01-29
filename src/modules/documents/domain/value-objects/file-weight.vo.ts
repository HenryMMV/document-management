import { InvalidDocumentWeightException } from '../errors/invalid-document-weight.exception';
import { ValueObject } from './value-object';

interface FileWeightProps {
  value: number;
}

export class FileWeight extends ValueObject<FileWeightProps> {
  private constructor(props: FileWeightProps) {
    super(props);
  }

  static create(raw: number): FileWeight {
    if (Number.isNaN(raw) || raw === undefined || raw === null) {
      throw new InvalidDocumentWeightException(raw as number);
    }
    if (raw <= 0 || raw > 1024 * 1024 * 1024 * 5) {
      throw new InvalidDocumentWeightException(raw);
    }
    return new FileWeight({ value: Math.round(raw) });
  }

  get value(): number {
    return this.props.value;
  }
}
