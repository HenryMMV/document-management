import { InvalidDocumentHashException } from '../errors/invalid-document-hash.exception';
import { ValueObject } from './value-object';

interface DocumentHashProps {
  value: string;
}

export class DocumentHash extends ValueObject<DocumentHashProps> {
  private constructor(props: DocumentHashProps) {
    super(props);
  }

  static create(raw: string): DocumentHash {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentHashException(raw ?? '');
    }
    if (value.length > 256) {
      throw new InvalidDocumentHashException(value);
    }
    return new DocumentHash({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
