import { InvalidDocumentCodeException } from '../errors/invalid-document-code.exception';
import { ValueObject } from './value-object';

interface DocumentCodeProps {
  value: string;
}

export class DocumentCode extends ValueObject<DocumentCodeProps> {
  private constructor(props: DocumentCodeProps) {
    super(props);
  }

  static create(raw: string): DocumentCode {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentCodeException(raw ?? '');
    }
    if (!/^[A-Z0-9_-]+$/i.test(value)) {
      throw new InvalidDocumentCodeException(value);
    }
    return new DocumentCode({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
