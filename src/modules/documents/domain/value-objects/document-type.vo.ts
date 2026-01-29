import { InvalidDocumentTypeException } from '../errors/invalid-document-type.exception';
import { ValueObject } from './value-object';

interface DocumentTypeProps {
  value: string;
}

export class DocumentType extends ValueObject<DocumentTypeProps> {
  private constructor(props: DocumentTypeProps) {
    super(props);
  }

  static create(raw: string): DocumentType {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentTypeException(raw ?? '');
    }
    if (value.length > 50) {
      throw new InvalidDocumentTypeException(value);
    }
    return new DocumentType({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
