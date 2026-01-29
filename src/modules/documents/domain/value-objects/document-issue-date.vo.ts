import { InvalidDocumentIssueDateException } from '../errors/invalid-document-issue-date.exception';
import { ValueObject } from './value-object';

interface DocumentIssueDateProps {
  year: number;
  month: number;
  day: number;
}

export class DocumentIssueDate extends ValueObject<DocumentIssueDateProps> {
  private constructor(props: DocumentIssueDateProps) {
    super(props);
  }

  static create(year: number, month: number, day: number): DocumentIssueDate {
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      throw new InvalidDocumentIssueDateException(year, month, day);
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new InvalidDocumentIssueDateException(year, month, day);
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw new InvalidDocumentIssueDateException(year, month, day);
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      throw new InvalidDocumentIssueDateException(year, month, day);
    }

    return new DocumentIssueDate({ year, month, day });
  }

  get year(): number {
    return this.props.year;
  }

  get month(): number {
    return this.props.month;
  }

  get day(): number {
    return this.props.day;
  }
}
