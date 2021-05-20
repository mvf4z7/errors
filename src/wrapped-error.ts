export class WrappedError extends Error {
  causedBy: Error;

  private stackDescriptor?: PropertyDescriptor;

  constructor(message: string, causedBy: Error) {
    super(message);
    this.name = 'WrappedError';
    this.causedBy = causedBy;
    this.stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');

    Object.defineProperty(this, 'stack', {
      get: () =>
        `${this.getStack.call(this)}\nCaused by: ${
          this.causedBy.stack ?? '<stack unavailable>'
        }`,
    });
  }

  private getStack(): string {
    if (!this.stackDescriptor) {
      return `${this.name}: ${this.message}`;
    }

    return this.stackDescriptor.get
      ? this.stackDescriptor.get()
      : this.stackDescriptor.value;
  }
}
