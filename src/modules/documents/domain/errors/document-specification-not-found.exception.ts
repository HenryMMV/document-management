import { DomainException } from './domain.exception';

export class DocumentSpecificationNotFoundException extends DomainException {
  constructor(applicationCode: string, documentType: string, documentGroup: string) {
    super(
      `Document specification not found for context: application=${applicationCode}, type=${documentType}, group=${documentGroup}`,
      'DOCUMENT.SPECIFICATION_NOT_FOUND',
    );
  }
}
