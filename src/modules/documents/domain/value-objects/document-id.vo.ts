import { InvalidDocumentIdException } from '../errors/invalid-document-id.exception';
import { ValueObject } from './value-object';

interface DocumentIdProps {
  value: string;
}

export class DocumentId extends ValueObject<DocumentIdProps> {
  private constructor(props: DocumentIdProps) {
    super(props);
  }

  static create(raw: string): DocumentId {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentIdException(raw ?? '');
    }
    if (!/^[0-9a-fA-F-]{8,}$/i.test(value)) {
      throw new InvalidDocumentIdException(value);
    }
    return new DocumentId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
