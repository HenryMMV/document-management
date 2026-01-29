import { InvalidDocumentUploaderException } from '../errors/invalid-document-uploader.exception';
import { ValueObject } from './value-object';

interface DocumentUploaderProps {
  value: string;
}

export class DocumentUploader extends ValueObject<DocumentUploaderProps> {
  private constructor(props: DocumentUploaderProps) {
    super(props);
  }

  static create(raw: string): DocumentUploader {
    const value = raw?.trim();
    if (!value) {
      throw new InvalidDocumentUploaderException(raw ?? '');
    }
    if (value.length > 100) {
      throw new InvalidDocumentUploaderException(value);
    }
    return new DocumentUploader({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
