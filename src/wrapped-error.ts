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
        `${this.getOwnStack.call(this)}${this.getCausedByStack(this.causedBy)}`,
    });
  }

  private getCausedByStack(error: Error): string {
    return `\nCaused by: ${error.stack ?? '<stack unavailable>'}`;
  }

  private getOwnStack(): string {
    if (!this.stackDescriptor) {
      return `${this.name}: ${this.message}`;
    }

    let stack = this.stackDescriptor.get
      ? this.stackDescriptor.get()
      : this.stackDescriptor.value;

    if (this.name !== 'WrappedError' && stack.indexOf('WrappedError') === 0) {
      stack = stack.replace('WrappedError', this.name);
    }

    return stack;
  }
}
