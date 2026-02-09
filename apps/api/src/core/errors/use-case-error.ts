export interface UseCaseErrorParams {
  message: string;
  statusCode: number;
  code?: string;
}

export abstract class UseCaseError extends Error {
  public readonly statusCode: number = 400;
  public readonly code?: string;

  constructor(params: UseCaseErrorParams) {
    const { message, statusCode = 400, code } = params;

    super(message);

    this.statusCode = statusCode;
    this.code = code;

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
