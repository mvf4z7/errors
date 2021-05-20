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
});
