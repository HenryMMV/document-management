import { ApplicationCode } from '../value-objects/application-code.vo';
import { DocumentGroup } from '../value-objects/document-group.vo';
import { DocumentType } from '../value-objects/document-type.vo';
import { FileExtension } from '../value-objects/file-extension.vo';
import { InvalidDocumentSpecificationException } from '../errors/invalid-document-specification.exception';

interface DocumentSpecificationProps {
  applicationCode: ApplicationCode;
  documentType: DocumentType;
  documentGroup: DocumentGroup;
  allowedExtensions: FileExtension[];
}

export class DocumentSpecification {
  private readonly props: DocumentSpecificationProps;

  private constructor(props: DocumentSpecificationProps) {
    this.props = props;
  }

  static create(
    applicationCode: ApplicationCode,
    documentType: DocumentType,
    documentGroup: DocumentGroup,
    allowedExtensions: FileExtension[],
  ): DocumentSpecification {
    if (!allowedExtensions?.length) {
      throw new InvalidDocumentSpecificationException('At least one extension is required');
    }
    const distinct = new Map<string, FileExtension>();
    allowedExtensions.forEach((extension) => {
      distinct.set(extension.value, extension);
    });
    return new DocumentSpecification({
      applicationCode,
      documentType,
      documentGroup,
      allowedExtensions: Array.from(distinct.values()),
    });
  }

  supports(extension: FileExtension): boolean {
    return this.props.allowedExtensions.some((item) => item.equals(extension));
  }

  sameContext(
    applicationCode: ApplicationCode,
    documentType: DocumentType,
    documentGroup: DocumentGroup,
  ): boolean {
    return (
      this.props.applicationCode.equals(applicationCode) &&
      this.props.documentType.equals(documentType) &&
      this.props.documentGroup.equals(documentGroup)
    );
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

  get extensions(): FileExtension[] {
    return [...this.props.allowedExtensions];
  }
}
