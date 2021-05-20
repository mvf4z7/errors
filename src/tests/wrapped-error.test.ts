import { WrappedError } from '../wrapped-error';

describe(WrappedError.name, () => {
  test('should make the wrapped Error accessible via the "causedBy" property', () => {
    const error = new Error('test error');
    const wrappedError = new WrappedError('some additional context', error);

    expect(wrappedError.causedBy).toBe(error);
  });

  test('should format the stack trace such that it displays both its own stack trace and the stack trace of the Error being wrapped', () => {
    let errorToWrap: Error | null = null;

    function outer(): string {
      return inner();
    }
    function inner(): string {
      const error = new Error('thrown from bar function');
      errorToWrap = error;
      throw error;
    }

    try {
      outer();
      fail('Function outer was expected to throw and it did not.');
    } catch (error) {
      const wrappedError = new WrappedError('Additional context', error);

      expect(
        wrappedError.stack?.indexOf('WrappedError: Additional context')
      ).toBe(0);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(wrappedError.stack).toContain(`Caused by: ${errorToWrap!.stack}`);
    }
  });

  test('should properly format stack traces when WrappedError errors are nested', () => {
    const originalError = new Error('Original error');
    const wrappedInner = new WrappedError('Inner context', originalError);
    const wrappedOuter = new WrappedError('Outer context', wrappedInner);

    const outerContextIndex = Number(
      wrappedOuter.stack?.indexOf('WrappedError: Outer context')
    );
    const innerContextIndex = Number(
      wrappedOuter.stack?.indexOf('Caused by: WrappedError: Inner context')
    );
    const originalErrorContextIndex = Number(
      wrappedOuter.stack?.indexOf('Caused by: Error: Original error')
    );

    expect(outerContextIndex).toBe(0);
    expect(innerContextIndex).toBeGreaterThan(outerContextIndex);
    expect(originalErrorContextIndex).toBeGreaterThan(innerContextIndex);
  });

  test('should be able to be extended', () => {
    class CustomWrappedError extends WrappedError {
      constructor(causedBy: Error) {
        super('A custom error message', causedBy);
        this.name = 'CustomWrappedError';
      }
    }

    const originalError = new Error('Original error');
    const customWrappedError = new CustomWrappedError(originalError);

    expect(customWrappedError.stack?.indexOf('CustomWrappedError:')).toBe(0);
    expect(
      customWrappedError.stack?.indexOf('Caused by: Error: Original error')
    ).toBeGreaterThan(0);
  });
});
