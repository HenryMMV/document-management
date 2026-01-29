import { CommandHandler } from '../../application/common/command-handler';
import { QueryHandler } from '../../application/common/query-handler';
import { SaveDocumentCommand } from '../../application/commands/save-document/save-document.command';
import { GetDocumentQuery } from '../../application/queries/get-document/get-document.query';
import { DocumentDto } from '../../application/dtos/document.dto';
import { HttpRequest } from './http-request';
import { HttpResponse, successResponse } from './http-response';
import { mapErrorToHttpResponse } from './error-mapper';

interface SaveDocumentRequestBody {
  lineadenegocio?: unknown;
  entidad?: unknown;
  anio?: unknown;
  mes?: unknown;
  dia?: unknown;
  id_identidad?: unknown;
  extension?: unknown;
  usuario?: unknown;
  aplicacion?: unknown;
  documetBase64?: unknown;
}

interface GetDocumentQueryParams {
  applicationCode?: unknown;
  documentCode?: unknown;
}

export class DocumentController {
  constructor(
    private readonly saveDocumentHandler: CommandHandler<SaveDocumentCommand, DocumentDto>,
    private readonly getDocumentHandler: QueryHandler<GetDocumentQuery, DocumentDto>,
  ) {}

  async saveDocument(request: HttpRequest<SaveDocumentRequestBody>): Promise<HttpResponse<DocumentDto>> {
    try {
      const body = request.body ?? {};

      const issueYear = DocumentController.toNumber(body.anio);
      const issueMonth = DocumentController.toNumber(body.mes);
      const issueDay = DocumentController.toNumber(body.dia);

      const command = new SaveDocumentCommand({
        lineadenegocio: DocumentController.toString(body.lineadenegocio),
        entidad: DocumentController.toString(body.entidad),
        anio: issueYear,
        mes: issueMonth,
        dia: issueDay,
        id_identidad: DocumentController.toString(body.id_identidad),
        extension: DocumentController.toString(body.extension),
        usuario: DocumentController.toString(body.usuario),
        aplicacion: DocumentController.toString(body.aplicacion),
        documetBase64: DocumentController.toString(body.documetBase64),
      });

      const document = await this.saveDocumentHandler.execute(command);

      return successResponse(201, document);
    } catch (error) {
      return mapErrorToHttpResponse<DocumentDto>(error);
    }
  }

  async getDocument(request: HttpRequest<unknown, GetDocumentQueryParams>): Promise<HttpResponse<DocumentDto>> {
    try {
      const query = request.query ?? {};
      const params = {
        applicationCode: DocumentController.toString(query.applicationCode),
        documentCode: DocumentController.toString(query.documentCode),
      };

      const result = await this.getDocumentHandler.execute(new GetDocumentQuery(params));

      return successResponse(200, result);
    } catch (error) {
      return mapErrorToHttpResponse<DocumentDto>(error);
    }
  }

  private static toString(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return DocumentController.toString(value[0]);
    }
    return String(value);
  }

  private static toNumber(value: unknown): number {
    if (value === undefined || value === null) {
      return Number.NaN;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (Array.isArray(value)) {
      return DocumentController.toNumber(value[0]);
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }
}
