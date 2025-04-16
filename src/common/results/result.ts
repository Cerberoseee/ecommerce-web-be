interface Error {
  message: string;
  statusCode: number;
  errorCode?: string;
  data?: any;
}

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: Error;
  private _value: T;

  private constructor(isSuccess: boolean, error?: Error, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
              successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
              needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  get value() {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }
    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: Error): Result<U> {
    return new Result<U>(false, error);
  }
}
