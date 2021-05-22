import { ClassType, StaticClass } from './type-utils';
import { WrappedError } from './wrapped-error';

export class Errors extends StaticClass {
  static unwrap<T extends Error>(
    error: Error,
    ErrorClass: ClassType<T>
  ): T | null {
    if (error instanceof ErrorClass) {
      return error;
    }

    if (error instanceof WrappedError) {
      if (error.causedBy instanceof ErrorClass) {
        return error.causedBy;
      } else if (error.causedBy instanceof WrappedError) {
        return Errors.unwrap(error.causedBy, ErrorClass);
      }
    }

    return null;
  }

  static wrap(message: string, error: Error): WrappedError {
    return new WrappedError(message, error);
  }

  static wraps<T extends Error>(
    error: Error,
    ErrorClass: ClassType<T>
  ): boolean {
    return Errors.unwrap(error, ErrorClass) !== null;
  }
}
