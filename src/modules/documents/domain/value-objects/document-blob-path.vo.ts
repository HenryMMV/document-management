import { InvalidBlobPathException } from '../errors/invalid-blob-path.exception';
import { ValueObject } from './value-object';

interface DocumentBlobPathProps {
  value: string;
}

export class DocumentBlobPath extends ValueObject<DocumentBlobPathProps> {
  private constructor(props: DocumentBlobPathProps) {
    super(props);
  }

  static create(raw: string): DocumentBlobPath {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidBlobPathException(raw ?? '');
    }
    if (value.length > 1024) {
      throw new InvalidBlobPathException(value);
    }
    return new DocumentBlobPath({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
