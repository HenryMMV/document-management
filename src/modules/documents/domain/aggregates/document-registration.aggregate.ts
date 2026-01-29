import { ApplicationCode } from '../value-objects/application-code.vo';
import { DocumentCode } from '../value-objects/document-code.vo';
import { DocumentGroup } from '../value-objects/document-group.vo';
import { DocumentId } from '../value-objects/document-id.vo';
import { DocumentStatus } from '../value-objects/document-status.vo';
import { DocumentType } from '../value-objects/document-type.vo';
import { FileExtension } from '../value-objects/file-extension.vo';
import { FileWeight } from '../value-objects/file-weight.vo';
import { DocumentSpecification } from '../entities/document-specification.entity';
import { DocumentAlreadyFinalizedException } from '../errors/document-already-finalized.exception';
import { DocumentAlreadyRegisteredException } from '../errors/document-already-registered.exception';
import { DocumentSpecificationMismatchException } from '../errors/document-specification-mismatch.exception';
import { InvalidDocumentStatusException } from '../errors/invalid-document-status.exception';
import { DocumentIssueDate } from '../value-objects/document-issue-date.vo';
import { DocumentVersion } from '../value-objects/document-version.vo';
import { DocumentFileName } from '../value-objects/document-file-name.vo';
import { DocumentBlobPath } from '../value-objects/document-blob-path.vo';
import { DocumentHash } from '../value-objects/document-hash.vo';
import { DocumentUploader } from '../value-objects/document-uploader.vo';
import { UploadDate } from '../value-objects/upload-date.vo';

interface DocumentRegistrationProps {
  id: DocumentId;
  applicationCode: ApplicationCode;
  documentCode: DocumentCode;
  documentType: DocumentType;
  documentGroup: DocumentGroup;
  issueDate: DocumentIssueDate;
  version: DocumentVersion;
  fileName: DocumentFileName;
  blobPath: DocumentBlobPath;
  extension: FileExtension;
  status: DocumentStatus;
  fileWeight: FileWeight;
  hash: DocumentHash;
  uploadedBy: DocumentUploader;
  uploadedAt: UploadDate;
}

export interface DocumentRegistrationSnapshot {
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
  extension: string;
  tamanoBytes: number;
  hash: string;
  usuario: string;
  fechaSubida: string;
  aplicacion: string;
  estado: string;
}

export class DocumentRegistration {
  private constructor(private props: DocumentRegistrationProps) {}

  static registerNew(
    props: Omit<DocumentRegistrationProps, 'status'>,
    specification: DocumentSpecification,
  ): DocumentRegistration {
    DocumentRegistration.guardAgainstMismatch(props, specification);

    const status = DocumentStatus.pending();

    return new DocumentRegistration({
      id: props.id,
      applicationCode: props.applicationCode,
      documentCode: props.documentCode,
      documentType: props.documentType,
      documentGroup: props.documentGroup,
      issueDate: props.issueDate,
      version: props.version,
      fileName: props.fileName,
      blobPath: props.blobPath,
      extension: props.extension,
      fileWeight: props.fileWeight,
      hash: props.hash,
      uploadedBy: props.uploadedBy,
      uploadedAt: props.uploadedAt,
      status,
    });
  }

  static restore(snapshot: DocumentRegistrationSnapshot): DocumentRegistration {
    return new DocumentRegistration({
      id: DocumentId.create(snapshot.id),
      applicationCode: ApplicationCode.create(snapshot.aplicacion),
      documentCode: DocumentCode.create(snapshot.id_identidad),
      documentType: DocumentType.create(snapshot.entidad),
      documentGroup: DocumentGroup.create(snapshot.lineadenegocio),
      issueDate: DocumentIssueDate.create(snapshot.anio, snapshot.mes, snapshot.dia),
      version: DocumentVersion.create(snapshot.version),
      fileName: DocumentFileName.create(snapshot.nombreArchivo),
      blobPath: DocumentBlobPath.create(snapshot.blobPath),
      extension: FileExtension.create(snapshot.extension),
      status: DocumentRegistration.restoreStatus(snapshot.estado),
      fileWeight: FileWeight.create(snapshot.tamanoBytes),
      hash: DocumentHash.create(snapshot.hash),
      uploadedBy: DocumentUploader.create(snapshot.usuario),
      uploadedAt: UploadDate.create(new Date(snapshot.fechaSubida)),
    });
  }

  private static restoreStatus(value: string): DocumentStatus {
    switch (value.toUpperCase()) {
      case 'PENDING':
        return DocumentStatus.pending();
      case 'REGISTERED':
        return DocumentStatus.registered();
      case 'FAILED':
        return DocumentStatus.failed();
      default:
        throw new InvalidDocumentStatusException(value);
    }
  }

  private static guardAgainstMismatch(
    props: Omit<DocumentRegistrationProps, 'status'>,
    specification: DocumentSpecification,
  ): void {
    if (!specification.sameContext(props.applicationCode, props.documentType, props.documentGroup)) {
      throw new DocumentSpecificationMismatchException('Context mismatch');
    }
    if (!specification.supports(props.extension)) {
      throw new DocumentSpecificationMismatchException('Extension is not allowed');
    }
  }

  markAsRegistered(): void {
    if (this.isRegistered()) {
      throw new DocumentAlreadyRegisteredException(this.props.documentCode.value);
    }
    this.props = {
      ...this.props,
      status: this.props.status.transitionTo('REGISTERED'),
    };
  }

  markAsFailed(): void {
    if (this.isFinalized()) {
      throw new DocumentAlreadyFinalizedException(this.props.documentCode.value);
    }
    this.props = {
      ...this.props,
      status: this.props.status.transitionTo('FAILED'),
    };
  }

  isRegistered(): boolean {
    return this.props.status.value === 'REGISTERED';
  }

  isFinalized(): boolean {
    return this.props.status.value !== 'PENDING';
  }

  toSnapshot(): DocumentRegistrationSnapshot {
    return {
      id: this.props.id.value,
      lineadenegocio: this.props.documentGroup.value,
      entidad: this.props.documentType.value,
      anio: this.props.issueDate.year,
      mes: this.props.issueDate.month,
      dia: this.props.issueDate.day,
      id_identidad: this.props.documentCode.value,
      version: this.props.version.value,
      nombreArchivo: this.props.fileName.value,
      blobPath: this.props.blobPath.value,
      extension: this.props.extension.value,
      tamanoBytes: this.props.fileWeight.value,
      hash: this.props.hash.value,
      usuario: this.props.uploadedBy.value,
      fechaSubida: this.props.uploadedAt.toISOString(),
      aplicacion: this.props.applicationCode.value,
      estado: this.props.status.value,
    };
  }

  matchesDocumentCode(documentCode: DocumentCode): boolean {
    return this.props.documentCode.equals(documentCode);
  }

  get status(): DocumentStatus {
    return this.props.status;
  }

  get documentCode(): DocumentCode {
    return this.props.documentCode;
  }

  get id(): DocumentId {
    return this.props.id;
  }

  get applicationCode(): ApplicationCode {
    return this.props.applicationCode;
  }

  get documentType(): DocumentType {
    return this.props.documentType;
  }

  get documentGroup(): DocumentGroup {
    return this.props.documentGroup;
  }

  get issueDate(): DocumentIssueDate {
    return this.props.issueDate;
  }

  get version(): DocumentVersion {
    return this.props.version;
  }

  get fileName(): DocumentFileName {
    return this.props.fileName;
  }

  get blobPath(): DocumentBlobPath {
    return this.props.blobPath;
  }

  get extension(): FileExtension {
    return this.props.extension;
  }

  get fileWeight(): FileWeight {
    return this.props.fileWeight;
  }

  get hash(): DocumentHash {
    return this.props.hash;
  }

  get uploadedBy(): DocumentUploader {
    return this.props.uploadedBy;
  }

  get uploadedAt(): UploadDate {
    return this.props.uploadedAt;
  }
}
