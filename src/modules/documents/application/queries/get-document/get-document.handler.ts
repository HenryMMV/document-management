import { QueryHandler } from '../../common/query-handler';
import { GetDocumentQuery } from './get-document.query';
import { DocumentDto, DocumentDtoMapper } from '../../dtos/document.dto';
import { DocumentRegistrationRepository } from '../../../domain/repositories/document-registration.repository';
import { ApplicationCode } from '../../../domain/value-objects/application-code.vo';
import { DocumentCode } from '../../../domain/value-objects/document-code.vo';
import { DomainException } from '../../../domain/errors/domain.exception';
import { DocumentRegistrationNotFoundException } from '../../../domain/errors/document-registration-not-found.exception';
import { ApplicationException } from '../../exceptions/application.exception';

export class GetDocumentQueryHandler implements QueryHandler<GetDocumentQuery, DocumentDto> {
  constructor(private readonly documentRegistrationRepository: DocumentRegistrationRepository) {}

  async execute(query: GetDocumentQuery): Promise<DocumentDto> {
    try {
      const { params } = query;
      const applicationCode = ApplicationCode.create(params.applicationCode);
      const documentCode = DocumentCode.create(params.documentCode);

      const document = await this.documentRegistrationRepository.findByCode(applicationCode, documentCode);
      if (!document) {
        throw new DocumentRegistrationNotFoundException(documentCode.value);
      }

      return DocumentDtoMapper.fromAggregate(document);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new ApplicationException('Unexpected error while retrieving document', error as Error);
    }
  }
}
