export abstract class BusinessError extends Error {
  protected constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends BusinessError {
  constructor(message = 'Resource not found') {
    super(message);
  }
}

export class NotAllowedError extends BusinessError {
  constructor(message = 'Not allowed') {
    super(message);
  }
}

export class ValidationError extends BusinessError {
  constructor(message = 'Validation error') {
    super(message);
  }
}

export class UniqueConstraintError extends BusinessError {
  constructor(message = 'Unique constraint error') {
    super(message);
  }
}

export class UploadImageError extends BusinessError {
  constructor(message = 'Error uploading image') {
    super(message);
  }
}
