import { Query } from '../../common/query';
import { DocumentDto } from '../../dtos/document.dto';

export interface GetDocumentQueryParams {
  applicationCode: string;
  documentCode: string;
}

export class GetDocumentQuery implements Query<DocumentDto> {
  readonly params: GetDocumentQueryParams;

  constructor(params: GetDocumentQueryParams) {
    this.params = params;
  }
}
