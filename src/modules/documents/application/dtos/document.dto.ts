import { DocumentRegistration } from '../../domain/aggregates/document-registration.aggregate';

export interface DocumentDto {
  id: string;
  applicationCode: string;
  businessLine: string;
  entity: string;
  documentCode: string;
  issueYear: number;
  issueMonth: number;
  issueDay: number;
  version: string;
  fileName: string;
  blobPath: string;
  extension: string;
  fileWeight: number;
  hash: string;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
}

export class DocumentDtoMapper {
  static fromAggregate(document: DocumentRegistration): DocumentDto {
    const snapshot = document.toSnapshot();
    return {
      id: snapshot.id,
      applicationCode: snapshot.aplicacion,
      businessLine: snapshot.lineadenegocio,
      entity: snapshot.entidad,
      documentCode: snapshot.id_identidad,
      issueYear: snapshot.anio,
      issueMonth: snapshot.mes,
      issueDay: snapshot.dia,
      version: snapshot.version,
      fileName: snapshot.nombreArchivo,
      blobPath: snapshot.blobPath,
      extension: snapshot.extension,
      fileWeight: snapshot.tamanoBytes,
      hash: snapshot.hash,
      uploadedBy: snapshot.usuario,
      uploadedAt: snapshot.fechaSubida,
      status: snapshot.estado,
    };
  }
}
