import { DomainException } from '../../domain/errors/domain.exception';
import { DocumentAlreadyFinalizedException } from '../../domain/errors/document-already-finalized.exception';
import { DocumentAlreadyRegisteredException } from '../../domain/errors/document-already-registered.exception';
import { DocumentRegistrationNotFoundException } from '../../domain/errors/document-registration-not-found.exception';
import { DocumentSpecificationNotFoundException } from '../../domain/errors/document-specification-not-found.exception';
import { ApplicationException } from '../../application/exceptions/application.exception';
import { HttpResponse, errorResponse } from './http-response';

const DEFAULT_DOMAIN_STATUS = 400;

function mapDomainStatus(error: DomainException): number {
  if (error instanceof DocumentRegistrationNotFoundException) {
    return 404;
  }
  if (error instanceof DocumentSpecificationNotFoundException) {
    return 404;
  }
  if (error instanceof DocumentAlreadyRegisteredException) {
    return 409;
  }
  if (error instanceof DocumentAlreadyFinalizedException) {
    return 409;
  }
  return DEFAULT_DOMAIN_STATUS;
}

export function mapErrorToHttpResponse<T>(error: unknown): HttpResponse<T> {
  if (error instanceof DomainException) {
    const status = mapDomainStatus(error);
    return errorResponse(status, error.code, error.message);
  }

  if (error instanceof ApplicationException) {
    return errorResponse(500, 'APPLICATION.ERROR', error.message);
  }

  return errorResponse(500, 'UNEXPECTED_ERROR', 'An unexpected error occurred');
}
