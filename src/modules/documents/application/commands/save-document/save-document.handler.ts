import { randomUUID, createHash } from 'crypto';
import { CommandHandler } from '../../common/command-handler';
import { SaveDocumentCommand } from './save-document.command';
import { DocumentDto, DocumentDtoMapper } from '../../dtos/document.dto';
import { DocumentRegistrationRepository } from '../../../domain/repositories/document-registration.repository';
import { DocumentSpecificationRepository } from '../../../domain/repositories/document-specification.repository';
import { ApplicationCode } from '../../../domain/value-objects/application-code.vo';
import { DocumentCode } from '../../../domain/value-objects/document-code.vo';
import { DocumentType } from '../../../domain/value-objects/document-type.vo';
import { DocumentGroup } from '../../../domain/value-objects/document-group.vo';
import { FileExtension } from '../../../domain/value-objects/file-extension.vo';
import { FileWeight } from '../../../domain/value-objects/file-weight.vo';
import { DocumentRegistration } from '../../../domain/aggregates/document-registration.aggregate';
import { DocumentSpecificationNotFoundException } from '../../../domain/errors/document-specification-not-found.exception';
import { DocumentAlreadyRegisteredException } from '../../../domain/errors/document-already-registered.exception';
import { DomainException } from '../../../domain/errors/domain.exception';
import { ApplicationException } from '../../exceptions/application.exception';
import { DocumentId } from '../../../domain/value-objects/document-id.vo';
import { DocumentIssueDate } from '../../../domain/value-objects/document-issue-date.vo';
import { DocumentVersion } from '../../../domain/value-objects/document-version.vo';
import { DocumentFileName } from '../../../domain/value-objects/document-file-name.vo';
import { DocumentBlobPath } from '../../../domain/value-objects/document-blob-path.vo';
import { DocumentHash } from '../../../domain/value-objects/document-hash.vo';
import { DocumentUploader } from '../../../domain/value-objects/document-uploader.vo';
import { UploadDate } from '../../../domain/value-objects/upload-date.vo';

export class SaveDocumentCommandHandler implements CommandHandler<SaveDocumentCommand, DocumentDto> {
  constructor(
    private readonly documentRegistrationRepository: DocumentRegistrationRepository,
    private readonly documentSpecificationRepository: DocumentSpecificationRepository,
  ) {}

  async execute(command: SaveDocumentCommand): Promise<DocumentDto> {
    try {
      const { payload } = command;
      const id = DocumentId.create(randomUUID());
      const applicationCode = ApplicationCode.create(payload.aplicacion);
      const documentGroup = DocumentGroup.create(payload.lineadenegocio);
      const documentType = DocumentType.create(payload.entidad);
      const documentCode = DocumentCode.create(payload.id_identidad);
      const issueDate = DocumentIssueDate.create(payload.anio, payload.mes, payload.dia);
      const extension = FileExtension.create(payload.extension);
      const uploadedBy = DocumentUploader.create(payload.usuario);

      const normalizedContent = SaveDocumentCommandHandler.normalizeBase64(payload.documetBase64);
      const fileBuffer = Buffer.from(normalizedContent, 'base64');
      const fileWeight = FileWeight.create(fileBuffer.byteLength);
      const hashValue = createHash('sha256').update(fileBuffer).digest('hex');
      const hash = DocumentHash.create(hashValue);

      const uploadedAtValue = new Date();
      const uploadedAt = UploadDate.create(uploadedAtValue);
      const version = DocumentVersion.create('V1');

      const generatedFileName = SaveDocumentCommandHandler.buildFileName(
        documentGroup.value,
        documentType.value,
        issueDate,
        documentCode.value,
        version,
        extension,
      );
      const fileName = DocumentFileName.create(generatedFileName);
      const blobPathValue = SaveDocumentCommandHandler.buildBlobPath(
        documentGroup.value,
        documentType.value,
        issueDate,
        generatedFileName,
      );
      const blobPath = DocumentBlobPath.create(blobPathValue);

      const exists = await this.documentRegistrationRepository.exists(documentCode);
      if (exists) {
        throw new DocumentAlreadyRegisteredException(documentCode.value);
      }

      const specification = await this.documentSpecificationRepository.findByContext(
        applicationCode,
        documentType,
        documentGroup,
      );

      if (!specification) {
        throw new DocumentSpecificationNotFoundException(
          applicationCode.value,
          documentType.value,
          documentGroup.value,
        );
      }

      const document = DocumentRegistration.registerNew(
        {
          id,
          applicationCode,
          documentCode,
          documentType,
          documentGroup,
          issueDate,
          version,
          fileName,
          blobPath,
          extension,
          fileWeight,
          hash,
          uploadedBy,
          uploadedAt,
        },
        specification,
      );

      await this.documentRegistrationRepository.save(document);

      return DocumentDtoMapper.fromAggregate(document);
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new ApplicationException('Unexpected error while saving document', error as Error);
    }
  }

  private static normalizeBase64(content: string): string {
    if (!content) {
      return '';
    }
    const trimmed = content.trim();
    if (!trimmed) {
      return '';
    }
    if (trimmed.startsWith('data:')) {
      const commaIndex = trimmed.indexOf(',');
      if (commaIndex !== -1) {
        return trimmed.slice(commaIndex + 1).replace(/\s+/g, '');
      }
    }
    return trimmed.replace(/\s+/g, '');
  }

  private static buildFileName(
    businessLine: string,
    entity: string,
    issueDate: DocumentIssueDate,
    documentCode: string,
    version: DocumentVersion,
    extension: FileExtension,
  ): string {
    const stamp = `${issueDate.year}${SaveDocumentCommandHandler.pad(issueDate.month)}${SaveDocumentCommandHandler.pad(issueDate.day)}`;
    return `${businessLine}-${entity}-${stamp}-${documentCode}_${version.value}${extension.toDotPrefixed()}`;
  }

  private static buildBlobPath(
    documentGroup: string,
    documentType: string,
    issueDate: DocumentIssueDate,
    fileName: string,
  ): string {
    const segments = [
      documentGroup,
      documentType,
      issueDate.year.toString(),
      SaveDocumentCommandHandler.pad(issueDate.month),
      SaveDocumentCommandHandler.pad(issueDate.day),
      fileName,
    ];
    return segments.join('/');
  }

  private static pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
