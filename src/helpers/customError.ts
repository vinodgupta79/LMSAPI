export class AppError extends Error {
  statusCode: number;
  status: number;
  isOperational: boolean;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = 0;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
