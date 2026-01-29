import { InvalidDocumentVersionException } from '../errors/invalid-document-version.exception';
import { ValueObject } from './value-object';

interface DocumentVersionProps {
  value: string;
}

export class DocumentVersion extends ValueObject<DocumentVersionProps> {
  private constructor(props: DocumentVersionProps) {
    super(props);
  }

  static create(raw: string): DocumentVersion {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentVersionException(raw ?? '');
    }
    if (!/^[A-Za-z0-9_.-]{1,20}$/.test(value)) {
      throw new InvalidDocumentVersionException(value);
    }
    return new DocumentVersion({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
