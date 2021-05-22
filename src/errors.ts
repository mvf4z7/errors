import { ClassType, StaticClass } from './type-utils';
import { WrappedError } from './wrapped-error';

export class Errors extends StaticClass {
  static unwrap<T>(error: Error, ErrorClass: ClassType<T>): T | null {
    if (error instanceof WrappedError && error.causedBy instanceof ErrorClass) {
      return error.causedBy;
    } else {
      return null;
    }
  }

  static wrap(message: string, error: Error): WrappedError {
    return new WrappedError(message, error);
  }
}
