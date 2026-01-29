import { InvalidDocumentFileNameException } from '../errors/invalid-document-file-name.exception';
import { ValueObject } from './value-object';

interface DocumentFileNameProps {
  value: string;
}

export class DocumentFileName extends ValueObject<DocumentFileNameProps> {
  private constructor(props: DocumentFileNameProps) {
    super(props);
  }

  static create(raw: string): DocumentFileName {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentFileNameException(raw ?? '');
    }
    if (value.length > 255) {
      throw new InvalidDocumentFileNameException(value);
    }
    return new DocumentFileName({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
