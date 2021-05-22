export interface ClassType<T> extends Function {
  new (...args: unknown[]): T;
}

export class StaticClass {
  constructor() {
    throw new Error(
      'A class that extends StaticClass can not be instantiated.'
    );
  }
}
