import { Errors } from '../errors';
import { WrappedError } from '../wrapped-error';

describe(Errors.name, () => {
  class CustomError extends Error {
    constructor() {
      super();
      this.name = 'CustomError';
    }
  }

  describe(Errors.wrap.name, () => {
    test(`should return an instance of ${WrappedError.name} with a causedBy property equal to the provided error`, () => {
      const errorToWrap = new Error('error to be wrapped');
      const wrappedError = Errors.wrap('Test message', errorToWrap);

      expect(wrappedError.causedBy).toBe(errorToWrap);
    });
  });

  describe(Errors.unwrap.name, () => {
    test('should return the provided Error if it is an instance of the provided Error class', () => {
      const customError = new CustomError();

      expect(Errors.unwrap(customError, CustomError)).toBe(customError);
    });

    test('should return null if provided an Error that is not an instance of the provided Error class or WrappedError', () => {
      const error = new Error();

      expect(Errors.unwrap(error, CustomError)).toBeNull();
    });

    test("should return a WrappedError's causedBy error if it is an instance of the provided Error class", () => {
      const customError = new CustomError();
      const wrappedCustomError = Errors.wrap('Extra context', customError);

      expect(Errors.unwrap(wrappedCustomError, CustomError)).toBe(customError);
    });

    test("should return a nested WrappedError's causedBy error if it is an instance of the provided Error class", () => {
      const customError = new CustomError();
      const wrappedOnce = Errors.wrap('wrappedOnce', customError);
      const wrappedTwice = Errors.wrap('wrappedTwice', wrappedOnce);

      expect(Errors.unwrap(wrappedTwice, CustomError)).toBe(customError);
    });
  });

  describe(Errors.wraps.name, () => {
    test('should return true if it is an instance of the provided Error class', () => {
      const customError = new CustomError();

      expect(Errors.wraps(customError, CustomError)).toBe(true);
    });

    test('should return false if provided an Error that is not an instance of the provided Error class or WrappedError', () => {
      const error = new Error();

      expect(Errors.wraps(error, CustomError)).toBe(false);
    });

    test('should return true if passed a WrappedError that has a causedBy property that is an instance of the provided Error class', () => {
      const customError = new CustomError();
      const wrappedCustomError = Errors.wrap('Extra context', customError);

      expect(Errors.wraps(wrappedCustomError, CustomError)).toBe(true);
    });

    test('should return true if passed a nested WrappedError with a causedBy property that is an instance of the provided Error class', () => {
      const customError = new CustomError();
      const wrappedOnce = Errors.wrap('wrappedOnce', customError);
      const wrappedTwice = Errors.wrap('wrappedTwice', wrappedOnce);

      expect(Errors.wraps(wrappedTwice, CustomError)).toBe(true);
    });
  });
});
