# Errors

A collection of utilities for working with JavaScript/TypeScript errors.
<br/><br/>

# Table of contents

- [Installation](#installation)
- [Errors Utility Functions](#errors-utility-functions)

  - [.wrap](#wrap)
  - [.wraps](#wraps)
  - [.unwrap](#unwrap)

- [WrappedError](#wrappederror)
  <br/><br/>

# Installation

```sh
npm install @mvf4z7/errors
```

<br />

# Errors utility functions

<a id="wrap"></a>

### `.wrap(message: string, error: Error) : WrappedError`

<br/>

Wraps the provided error in a new error ([`WrappedError`](#wrappederror)) that has its `message` property set to the provided message string and a `stack` property composed of the stack traces of the provided error and the newly created error. See the `WrappedError` docs for more details on the returned error object.
<br/><br/>

```ts
try {
  const id = 123;
  getFooById(id);
} catch (error) {
  throw Errors.wrap(`Failed to get Foo with ID ${id}.`, error);
}
```

<br/>

<a id="wraps"></a>

### `.wraps<T extends Error>(error: Error, ErrorClass: ClassType<T>): boolean`

<br/>

Tests if the provided error object is an instance of the provided error class or wraps an error of the provided error class. If the provided error object is an instance of the `WrappedError` class or another class that extends `WrappedError`, the errors `causeBy` property will be recursively checked for instances of the provided error class.
<br/><br/>

```ts
class CustomError extends Error {
  constructor() {
    super('A meaningful error message');
    this.name = 'CustomError';
  }
}

const customError = new CustomerError();
const wrappedError = Errors.wrap('Additional error message', customError);

Errors.wraps(customError, CustomError); // true
Errors.wraps(wrappedError, CustomError); // true
Errors.wraps(customError, TypeError); // false
Errors.wraps(wrappedError, TypeError); // false
```

<br/>

<a id="unwrap"></a>

### `.unwrap<T extends Error>(error: Error, ErrorClass: ClassType<T>): T | null`

<br/>

If the provided error object is an instance of `WrappedError` then the error's `causedBy` property is unwrapped recursively until an instance of `ErrorClass` is found, at which time it is returned. If the provided error is not an instance of `WrappedError`, the error will be returned if it is an instance of `ErrorClass`.

In either scenario, if an instance of `ErrorClass` is not found then `null` is returned.
<br/><br/>

```ts
class CustomError extends Error {
  constructor() {
    super('A meaningful error message');
    this.name = 'CustomError';
  }
}

const customError = new CustomError();
const wrapped = Errors.wrap('Additional error message', customError);
const wrappedTwice = Errors.wrap(
  'Yet another error message',
  wrappedCustomError
);

Errors.unwrap(wrapped, CustomError); // customError
Errors.unwrap(wrappedTwice, CustomError); // customError
Errors.unwrap(customError, CustomError); // customError

Errors.unwrap(wrapped, TypeError); // null
Errors.unwrap(customError, TypeError); // null
```

<br/>

# WrappedError
