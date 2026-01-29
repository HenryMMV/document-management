import { InvalidFileExtensionException } from '../errors/invalid-file-extension.exception';
import { ValueObject } from './value-object';

interface FileExtensionProps {
  value: string;
}

export class FileExtension extends ValueObject<FileExtensionProps> {
  private constructor(props: FileExtensionProps) {
    super(props);
  }

  static create(raw: string): FileExtension {
    const value = raw?.trim().replace('.', '') ?? '';
    if (!value) {
      throw new InvalidFileExtensionException(raw ?? '');
    }
    if (!/^[a-z0-9]+$/i.test(value) || value.length > 10) {
      throw new InvalidFileExtensionException(value);
    }
    return new FileExtension({ value: value.toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }

  toDotPrefixed(): string {
    return `.${this.props.value}`;
  }
}
