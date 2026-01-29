export class ApplicationException extends Error {
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
