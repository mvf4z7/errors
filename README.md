# Errors

A collection of utilities for working with JavaScript/TypeScript errors.
<br/><br/>

# Table of contents

- [Installation](#installation)
- [WrappedError](#wrappederror)
- [Errors Utility Functions](#errors-utility-functions)
  - [.wrap](#wrap)
  - [.wraps](#wraps)
  - [.unwrap](#unwrap)
    <br/><br/>

# Installation

```sh
npm install @mvf4z7/errors
```

<br />

# WrappedError

An error class that can be used to wrap an existing error object with a new one. The new error has it's own error message, but the stack trace is composed of the newly created error and the wrapped error.

```ts
const error = new Error('message');
const wrappedError = new WrappedError('Additional message', error);
```

<br/>

### `WrappedError.causedBy`

<br/>

A reference to the original error that was wrapped.

```ts
const error = new Error('message');
const wrappedError = new WrappedError('additional message', error);

wrappedError.causedBy === error; // true
```

<br/>

### `WrappedError.stack`

Because `WrappedError` extends the built in `Error` class, a `WrappedError` instance stores a stack trace that can be referenced through the `stack` property. A `WrappedError`'s stack trace is composed of the stack trace of the `WrappedError`'s own stack trace, as well as the stack trace of the error that was was wrapped.

```ts
function fetchUsers() {
  throw new Error('Network error!');
}

try {
  try {
    fetchUsers();
  } catch (error) {
    throw new WrappedError('Failed to fetch users', error);
  }
} catch (error) {
  console.log(error.stack);

  /* error.stack value
  
  WrappedError: Failed to fetch users
      at Object.<anonymous> (/Users/john-doe/Code/errors-test/index.js:11:11)
      at Module._compile (internal/modules/cjs/loader.js:1068:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1097:10)
      at Module.load (internal/modules/cjs/loader.js:933:32)
      at Function.Module._load (internal/modules/cjs/loader.js:774:14)
      at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
      at internal/main/run_main_module.js:17:47
  Caused by: Error: Network error!
      at fetchUsers (/Users/john-doe/Code/errors-test/index.js:4:9)
      at Object.<anonymous> (/Users/john-doe/Code/errors-test/index.js:9:5)
      at Module._compile (internal/modules/cjs/loader.js:1068:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1097:10)
      at Module.load (internal/modules/cjs/loader.js:933:32)
      at Function.Module._load (internal/modules/cjs/loader.js:774:14)
      at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
      at internal/main/run_main_module.js:17:47

    */
}
```

<br/>

# Errors utility functions

<a id="wrap"></a>

### `.wrap(message: string, error: Error) : WrappedError`

<br/>

A shorthand function for creating an instance of `WrappedError`. See the `WrappedError` [docs](#wrappederror) for more details on the returned error object.

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
