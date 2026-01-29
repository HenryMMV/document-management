export interface DocumentRegistrationCosmosModel {
  id: string;
  lineadenegocio: string;
  entidad: string;
  anio: number;
  mes: number;
  dia: number;
  id_identidad: string;
  version: string;
  nombreArchivo: string;
  blobPath: string;
  estado: string;
  extension: string;
  tamanoBytes: number;
  hash: string;
  usuario: string;
  fechaSubida: string;
  aplicacion: string;
  entityType: 'DocumentRegistration';
}
