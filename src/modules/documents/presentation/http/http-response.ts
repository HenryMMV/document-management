export interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ResponseEnvelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

export interface HttpResponse<T> {
  status: number;
  body: ResponseEnvelope<T>;
}

export function successResponse<T>(status: number, data: T): HttpResponse<T> {
  return {
    status,
    body: {
      success: true,
      data,
    },
  };
}

export function errorResponse<T>(status: number, code: string, message: string): HttpResponse<T> {
  return {
    status,
    body: {
      success: false,
      error: {
        code,
        message,
      },
    },
  };
}
