import { InvalidDocumentStatusTransitionException } from '../errors/invalid-document-status-transition.exception';
import { ValueObject } from './value-object';

export type DocumentStatusName = 'PENDING' | 'REGISTERED' | 'FAILED';

interface DocumentStatusProps {
  value: DocumentStatusName;
}

const allowedTransitions: Record<DocumentStatusName, DocumentStatusName[]> = {
  PENDING: ['REGISTERED', 'FAILED'],
  REGISTERED: [],
  FAILED: [],
};

export class DocumentStatus extends ValueObject<DocumentStatusProps> {
  private constructor(props: DocumentStatusProps) {
    super(props);
  }

  static pending(): DocumentStatus {
    return new DocumentStatus({ value: 'PENDING' });
  }

  static registered(): DocumentStatus {
    return new DocumentStatus({ value: 'REGISTERED' });
  }

  static failed(): DocumentStatus {
    return new DocumentStatus({ value: 'FAILED' });
  }

  get value(): DocumentStatusName {
    return this.props.value;
  }

  transitionTo(target: DocumentStatusName): DocumentStatus {
    if (!allowedTransitions[this.props.value].includes(target)) {
      throw new InvalidDocumentStatusTransitionException(this.props.value, target);
    }
    return new DocumentStatus({ value: target });
  }
}
