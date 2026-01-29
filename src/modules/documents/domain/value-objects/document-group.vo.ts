import { InvalidDocumentGroupException } from '../errors/invalid-document-group.exception';
import { ValueObject } from './value-object';

interface DocumentGroupProps {
  value: string;
}

export class DocumentGroup extends ValueObject<DocumentGroupProps> {
  private constructor(props: DocumentGroupProps) {
    super(props);
  }

  static create(raw: string): DocumentGroup {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentGroupException(raw ?? '');
    }
    if (value.length > 50) {
      throw new InvalidDocumentGroupException(value);
    }
    return new DocumentGroup({ value: value.toUpperCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
