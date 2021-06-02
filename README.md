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

## `.wrap(message: string, error: Error) : WrappedError`

<br/>

Wraps the provided error in a new error ([`WrappedError`](#wrappederror)) that has its `message` property set to the provided message string and a `stack` property composed of the stack traces of the provided error and the newly created error. See the `WrappedError` docs for more details on the returned error object.
<br/><br/>

```typescript
try {
  const id = 123;
  getFooById(id);
} catch (error) {
  throw Errors.wrap(`Failed to get Foo with ID ${id}.`, error);
}
```

<br/>

<a id="wraps"></a>

## `.wraps(error: Error, ErrorClass): boolean`

<br/>

Tests if the provided error object is an instance of the provided error class or wraps an error of the provided error class. If the provided error object is an instance of the `WrappedError` class or another class that extends `WrappedError`, the errors `causeBy` property will be recursively checked for instances of the provided error class.
<br/><br/>

```typescript
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

## `.unwrap`

# WrappedError
