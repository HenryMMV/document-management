import { Command } from '../../common/command';
import { DocumentDto } from '../../dtos/document.dto';

export interface SaveDocumentCommandPayload {
  lineadenegocio: string;
  entidad: string;
  anio: number;
  mes: number;
  dia: number;
  id_identidad: string;
  extension: string;
  usuario: string;
  aplicacion: string;
  documetBase64: string;
}

export class SaveDocumentCommand implements Command<DocumentDto> {
  readonly payload: SaveDocumentCommandPayload;

  constructor(payload: SaveDocumentCommandPayload) {
    this.payload = payload;
  }
}
