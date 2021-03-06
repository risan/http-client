# HTTP Client

HTTP client for browser, a wrapper for [`ky`](https://github.com/sindresorhus/ky).

[![CircleCI](https://circleci.com/gh/risan/http-client.svg?style=shield)](https://circleci.com/gh/risan/http-client)
[![Codecov](https://codecov.io/gh/risan/http-client/branch/master/graph/badge.svg)](https://codecov.io/gh/risan/http-client)
[![NPM](https://img.shields.io/npm/v/@risan/http-client)](https://www.npmjs.com/package/@risan/http-client)

## Installation

```bash
$ npm install @risan/http-client
```

### CDN

You can also use the CDN directly:

```html
<script src="https://unpkg.com/@risan/http-client@latest/dist/HttpClient.umd.js"></script>

<!-- Or the minified version -->
<script src="https://unpkg.com/@risan/http-client@latest/dist/HttpClient.umd.min.js"></script>
```

## Usage

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json')
  .then(res => console.log(res.body));

client.post('/post', { foo: 'bar' })
  .then(res => console.log(res.body));
```

## API

**`HttpClient`**

- [`HttpClient()`](#httpclient)
- [`HttpClient.request()`](#httpclientrequest)
- [`HttpClient.get()`](#httpclientget)
- [`HttpClient.post()`](#httpclientpost)
- [`HttpClient.put()`](#httpclientput)
- [`HttpClient.patch()`](#httpclientpatch)
- [`HttpClient.delete()`](#httpclientdelete)
- [`HttpClient.setDefaultOption()`](#httpclientsetDefaultOption)
- [`HttpClient.removeDefaultOption()`](#httpclientremovedefaultoption)
- [`HttpClient.setDefaultHeader()`](#httpclientsetdefaultheader)
- [`HttpClient.removeDefaultHeader()`](#httpclientremovedefaultheader)
- [`HttpClient.setDefaultBearerToken()`](#httpclientsetdefaultbearertoken)
- [`HttpClient.removeDefaultBearerToken()`](#httpclientremovedefaultbearertoken)

**`HttpResponse`**

- [`HttpResponse.body`](#httpresponsebody)
- [`HttpResponse.status`](#httpresponsestatus)
- [`HttpResponse.headers`](#httpresponseheaders)
- [`HttpResponse.isSuccess()`](#httpresponseissuccess)
- [`HttpResponse.isError()`](#httpresponseiserror)
- [`HttpResponse.isOk()`](#httpresponseisok)
- [`HttpResponse.isClientError()`](#httpresponseisclienterror)
- [`HttpResponse.isServerError()`](#httpresponseisservererror)
- [`HttpResponse.isUnauthorized()`](#httpresponseisunauthorized)
- [`HttpResponse.isForbidden()`](#httpresponseisforbidden)
- [`HttpResponse.isNotFound()`](#httpresponseisnotfound)
- [`HttpResponse.isValidationError()`](#httpresponseisvalidationerror)
- [`HttpResponse.contentType()`](#httpresponsecontenttype)
- [`HttpResponse.isImage()`](#httpresponseisimage)
- [`HttpResponse.isJson()`](#httpresponseisjson)
- [`HttpResponse.isText()`](#httpresponseistext)

**`HttpHeaders`**

- [`HttpHeaders.get()`](#httpheadersget)
- [`HttpHeaders.has()`](#httpheadershas)
- [`HttpHeaders.contentType()`](#httpheaderscontenttype)

**`HttpError`**

- [`HttpError.message`](#httperrormessage)
- [`HttpError.response`](#httperrorresponse)
- [`HttpError.validationErrors`](#httperrorvalidationerrors)
- [`HttpError.hasResponse`](#httperrorhasresponse)
- [`HttpError.hasValidationErrors`](#httperrorhasvalidationerrors)

### `HttpClient`

#### `HttpClient()`

Create a new `HttpClient` instance.

```js
new HttpClient(prefixUrl: String, defaultOptions = {})
```

- `prefixUrl` *(`String`)*: A prefix to prepend to the URL when making the request.
- `defaultOptions` *(`Object`)*: A default options to use when making the request. This `defaultOptions` will be merged with the `options` parameter when making the request. Check [Options](#options) for all possible configurations.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: ['application/json', 'text/plain'],
  },
  credentials: 'same-origin',
  timeout: 10000,
  onError(error) {
    console.log(error.message);

    throw new Error('custom error');
  },
  onSuccess(res) {
    console.log(res.body);

    return 'custom result';
  },
});
```

#### Options

The request's options are similar to [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) with slight differences:

- `headers` *(`Object`)*: Unlike `fetch()`, it only accepts an object literal.
- `credentials` *(`String`)*: Default to `same-origin`.

It also accepts similar options as [`ky`](https://github.com/sindresorhus/ky#options):

- [`searchParams`](https://github.com/sindresorhus/ky#searchparams): Search parameters to include in the request URL.
- [`retry`](https://github.com/sindresorhus/ky#retry) *(`Object|Number`)*: Maximum retry count.
- [`timeout`](https://github.com/sindresorhus/ky#timeout) *(`Number|false`)*: Timeout in milliseconds for getting a response, default to `10000`.
- [`hooks`](https://github.com/sindresorhus/ky#hooks) *(`Object`)*: Hooks allow modifications during the request lifecycle.
- [`onDownloadProgress`](https://github.com/sindresorhus/ky#ondownloadprogress) *(`Function`)*: Download progress event handler.

However this library will always set the [`throwHttpErrors`](https://github.com/sindresorhus/ky#throwhttperrors) option to `true`.

This library also accepts the following options:

- `onError` *(`Function`)*: A callback function to call when an error response is received (status code >= 400). The function will receive an [`HttpError`](#httperror) instance as its parameter.
- `onSuccess` *(`Function`)*: A callback function to call when a successful response is received (status code between 200-299). The function will receive an [`HttpResponse`](#httpresponse) instance as its parameter.
- `responseType` *(`String`)*: Responses' body type, its the [`Body`](https://developer.mozilla.org/en-US/docs/Web/API/Body)'s method name to call to read and parse the responses' body (`arrayBuffer`, `blob`, `formData`, `json`, or `text`). If you don't set the `responseType`, the body will be parsed based on its content-type header.
- `errorMessagePath` *(`String`)*: A path to a custom error message in JSON response.
- `validationErrorsPath` *(`String`)*: A path to a custom validation errors detail in JSON response.

#### `HttpClient.request()`

Send HTTP request to `url` with the given HTTP `method`. The given [`options`](#options) will be merged with the previously set `defaultOptions`. On successful operation, it will return a `Promise` that will resolve to the [`HttpResponse`](#httpresponse) instance. On error, it will throw an [`HttpError`](#httperror).

```js
HttpClient.request(method: String, url: String, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.request('GET', '/json', {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.get()`

A shortcut method to send HTTP GET request.

```js
HttpClient.get(url: String, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json', {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.post()`

A shortcut method to send HTTP POST request.

```js
HttpClient.post(url: String, body = null, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.post('/post', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.put()`

A shortcut method to send HTTP PUT request.

```js
HttpClient.put(url: String, body = null, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.put('/put', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.patch()`

A shortcut method to send HTTP PATCH request.

```js
HttpClient.patch(url: String, body = null, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.patch('/patch', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.delete()`

A shortcut method to send HTTP DELETE request.

```js
HttpClient.delete(url: String, options = {}): Promise
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.delete('/delete', {
  headers: {
    accept: 'application/json',
  },
}).then(res => console.log(res.body));
```

#### `HttpClient.setDefaultOption()`

Set a default option at `key` with `value`. This method returns the `HttpClient` instance itself.

```js
HttpClient.setDefaultOption(key: String, value: Any): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  mode: 'same-origin',
  headers: {
    accept: 'image/png',
  },
});

client.setDefaultOption('mode', 'cors')
  .setDefaultOption('headers.accept', ['application/json', 'text/plain']);

// {
//   mode: 'cors',
//   headers: {
//     accept: ['application/json', 'text/plain'],
//   },
// }
console.log(client.defaultOptions);
```

#### `HttpClient.removeDefaultOption()`

Remove a default option at `key`. This method returns the `HttpClient` instance itself.

```js
HttpClient.removeDefaultOption(key: String): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  mode: 'same-origin',
  credentials: 'same-origin',
  headers: {
    accept: ['application/json', 'text/plain'],
  },
});

client.removeDefaultOption('mode')
  .removeDefaultOption('headers.accept');

// {
//   credentials: 'same-origin',
//   headers: {},
// }
console.log(client.defaultOptions);
```

#### `HttpClient.setDefaultHeader()`

Set a default header at `key` with `value`. This method returns the `HttpClient` instance itself.

```js
HttpClient.setDefaultHeader(key: String, value: String | Array): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: 'image/png',
  },
});

client.setDefaultHeader('accept', ['application/json', 'text/plain'])
  .setDefaultHeader('content-type', 'application/json');

// {
//   headers: {
//     accept: ['application/json', 'text/plain'],
//     'content-type': 'application/json',
//   },
// }
console.log(client.defaultOptions);
```

#### `HttpClient.removeDefaultHeader()`

Remove a default header at `key`. This method returns the `HttpClient` instance itself.

```js
HttpClient.removeDefaultHeader(key: String): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: 'image/png',
    'content-type': 'application/json',
  },
});

client.removeDefaultHeader('accept');

// {
//   headers: {
//     'content-type': 'application/json',
//   },
// }
console.log(client.defaultOptions);
```

#### `HttpClient.setDefaultBearerToken()`

Set a default bearer token in authorization header. This method returns the `HttpClient` instance itself.

```js
HttpClient.setDefaultBearerToken(token: String): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: 'application/json',
  },
});

client.setDefaultBearerToken('secret');

// {
//   headers: {
//     accept: 'application/json',
//     authorization: 'Bearer secret',
//   },
// }
console.log(client.defaultOptions);
```

#### `HttpClient.removeDefaultBearerToken()`

Remove any default authorization header. This method returns the `HttpClient` instance itself.

```js
HttpClient.removeDefaultBearerToken(): HttpClient
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: 'application/json',
    authorization: 'Bearer secret',
  },
});

client.removeDefaultBearerToken();

// {
//   headers: {
//     accept: 'application/json',
//   },
// }
console.log(client.defaultOptions);
```

### `HttpResponse`

#### `HttpResponse.body`

Get the responses' body.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

// If responses' content-type is application/json, response.body will be
// automatically parsed to object.
client.get('/json')
  .then(res => console.log(res.body));
```

#### `HttpResponse.status`

Get the responses' status code *(`Number`)*.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/204')
  .then(res => console.log(res.status)); // 204
```

#### `HttpResponse.headers`

Get the responses' headers *([`HttpHeaders`](#httpheaders))*.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json').then(res => {
  console.log(res.headers.has('content-type')); // true
  console.log(res.headers.get('content-type')); // application/json
  console.log(res.headers['content-type']);     // application/json
});
```

#### `HttpResponse.isSuccess()`

Check if the received `HttpResponse` instance is successful (status code between 200-299).

```js
HttpResponse.isSuccess(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/200')
  .then(res => console.log(res.isSuccess())); // true

client.get('/status/400').then(
  res => {},
  error => console.log(error.response.isSuccess()) // false
);
```

#### `HttpResponse.isError()`

Check if the received `HttpResponse` instance is error (status code >= 400).

```js
HttpResponse.isError(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/200')
  .then(res => console.log(res.isError())); // false

client.get('/status/400').then(
  res => {},
  error => console.log(error.response.isError()) // true
);
```

#### `HttpResponse.isOk()`

Check if the status code is 200.

```js
HttpResponse.isOk(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/200')
  .then(res => console.log(res.isOk())); // true

client.get('/status/201')
  .then(res => console.log(res.isOk())); // false
```

#### `HttpResponse.isClientError()`

Check if the received `HttpResponse` instance is client error (status code between 400-499).

```js
HttpResponse.isClientError(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/401').then(
  res => {},
  error => console.log(error.response.isClientError()) // true
);

client.get('/status/500').then(
  res => {},
  error => console.log(error.response.isClientError()) // false
);
```

#### `HttpResponse.isServerError()`

Check if the received `HttpResponse` instance is server error (status code >= 500).

```js
HttpResponse.isServerError(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/500').then(
  res => {},
  error => console.log(error.response.isServerError()) // true
);

client.get('/status/404').then(
  res => {},
  error => console.log(error.response.isServerError()) // false
);
```

#### `HttpResponse.isUnauthorized()`

Check if the status code is 401.

```js
HttpResponse.isUnauthorized(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/401').then(
  res => {},
  error => console.log(error.response.isUnauthorized()) // true
);

client.get('/status/404').then(
  res => {},
  error => console.log(error.response.isUnauthorized()) // false
);
```

#### `HttpResponse.isForbidden()`

Check if the status code is 403.

```js
HttpResponse.isForbidden(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/403').then(
  res => {},
  error => console.log(error.response.isForbidden()) // true
);

client.get('/status/404').then(
  res => {},
  error => console.log(error.response.isForbidden()) // false
);
```

#### `HttpResponse.isNotFound()`

Check if the status code is 404.

```js
HttpResponse.isNotFound(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/404').then(
  res => {},
  error => console.log(error.response.isNotFound()) // true
);

client.get('/status/400').then(
  res => {},
  error => console.log(error.response.isNotFound()) // false
);
```

#### `HttpResponse.isValidationError()`

Check if the status code is 422.

```js
HttpResponse.isValidationError(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/422').then(
  res => {},
  error => console.log(error.response.isValidationError()) // true
);

client.get('/status/400').then(
  res => {},
  error => console.log(error.response.isValidationError()) // false
);
```

#### `HttpResponse.contentType()`

Get response content-type header value.

```js
HttpResponse.contentType(): String
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json')
  .then(res => console.log(res.contentType())); // application/json

client.get('/image/png')
  .then(res => console.log(res.contentType())); // image/png
```

#### `HttpResponse.isImage()`

Check if the response content-type header starts with `image/`.

```js
HttpResponse.isImage(): String
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/image/png')
  .then(res => console.log(res.isImage())); // true

client.get('/json')
  .then(res => console.log(res.isImage())); // false
```

#### `HttpResponse.isJson()`

Check if the response content-type header contains `/json` or `+json`.

```js
HttpResponse.isJson(): String
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json')
  .then(res => console.log(res.isJson())); // true

client.get('/image/png')
  .then(res => console.log(res.isJson())); // false
```

#### `HttpResponse.isText()`

Check if the response content-type header starts with `text/`.

```js
HttpResponse.isText(): String
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/html')
  .then(res => console.log(res.isText())); // true

client.get('/json')
  .then(res => console.log(res.isText())); // false
```

### `HttpHeaders`

It represents the HTTP headers on the response. The `HttpResponse.headers` is an instance of this class. You can access the header value by accessing the `HttpHeader` property directly. Note that the property key is in lower case.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/image/png').then(res => {
  console.log(res.headers['content-type']);   // image/png
  console.log(res.headers['content-length']); // 8090
  console.log(res.headers.foo);               // undefined
});
```

#### `HttpHeaders.get()`

Get the header value at `key`. The `key` is case insensitive.

```js
HttpHeaders.get(key: String): String | undefined
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/image/png').then(res => {
  console.log(res.headers.get('content-type')); // image/png
  console.log(res.headers.get('foo'));          // undefined
});
```

#### `HttpHeaders.has()`

Check if the header at `key` exists. The `key` is case insensitive.

```js
HttpHeaders.get(key: String): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/image/png').then(res => {
  console.log(res.headers.has('content-type')); // true
  console.log(res.headers.has('foo'));          // false
});
```

#### `HttpHeaders.contentType()`

Get the header content-type value.

```js
HttpHeaders.contentType(): String
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/image/png')
  .then(res => console.log(res.headers.contentType())); // image/png
```

### `HttpError`

The `HttpError` instance will be thrown when request failed or the error response is received (status code >= 400).

#### `HttpError.message`

The error mesage.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/foo').then(
  res => {},
  error => console.log(error.message) // Failed to fetch
);
```

#### `HttpError.response`

The [`HttpResponse`](#httpresponse) instance. If there's no response, this property will have `null` value.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/400').then(
  res => {},
  error => console.log(error.response) // HttpResponse instance
);

client.get('/foo').then(
  res => {},
  error => console.log(error.response) // null
);
```

#### `HttpError.validationErrors`

The validation errors object. It will only be available if the status code is 422 and the given `validationErrorsPath` exists in the response JSON.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('http://www.mocky.io/v2', {
  validationErrorsPath: 'errors',
});

// http://www.mocky.io/v2/5e4ffabc3000005100226d1c
// {
//   "message": "Custom error",
//   "errors": {
//     "email": ["error1", "error2"]
//   }
// }
client.get('/5e4ffabc3000005100226d1c').then(
  res => {},
  error => console.log(error.validationErrors) // { email: ["error1", "error2"] }
);
```

#### `HttpError.hasResponse()`

Check if the error has `HttpResponse` instance.

```js
HttpError.hasResponse(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/400').then(
  res => {},
  error => console.log(error.hasResponse()) // true
);

client.get('/foo').then(
  res => {},
  error => console.log(error.hasResponse()) // false
);
```

#### `HttpError.hasValidationErrors()`

Check if the `validationErrors` property is not empty.

```js
HttpError.hasValidationErrors(): Boolean
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('http://www.mocky.io/v2', {
  validationErrorsPath: 'errors',
});

// http://www.mocky.io/v2/5e4ffabc3000005100226d1c
// {
//   "message": "Custom error",
//   "errors": {
//     "email": ["error1", "error2"]
//   }
// }
client.get('/5e4ffabc3000005100226d1c').then(
  res => {},
  error => console.log(error.hasValidationErrors()) // true
);
```

## Guide

### Set Default Headers

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org', {
  headers: {
    accept: 'application/json',
  },
});

client.get('/json')
  .then(res => console.log(res.body));

// Override default accept headers.
client.get('/html', {
  headers: {
    accept: 'text/html',
  },
}).then(res => console.log(res.body));
```

### Send JSON Body

If you don't set any header content-type, the `body` with object literal will be sent as JSON. The header content-type will also be set to `application/json`.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.post('/post', { id: 123, name: 'john' })
  .then(res => console.log(res.body));
```

### Send URL Encoded Body

To send a URL encoded body, all you have to do is set the header content-type to `application/x-www-form-urlencoded`.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.post('/post', { id: 123, name: 'john' }, {
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
}).then(res => console.log(res.body));
```

Or you can also pass the [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) instance as the body.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

const searchParams = new URLSearchParams();
searchParams.set('id', 123);
searchParams.set('name', 'john');

client.post('/post', searchParams)
  .then(res => console.log(res.body));
```

### Send Multipart Form Data

To send a multipart form data body, all you have to do is set the header content-type to `multipart/form-data`.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.post('/post', { id: 123, name: 'john' }, {
  headers: {
    'content-type': 'multipart/form-data',
  },
}).then(res => console.log(res.body));
```

Or you can also pass the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instance as the body.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

const formData = new FormData();
formData.append('id', 123);
formData.append('name', 'john');

client.post('/post', formData)
  .then(res => console.log(res.body));
```

### Custom Error Message from Response

By default, the error message in [`HttpError`](#httperror) is coming from the HTTP status text in the received response. If the received error response is in JSON, you may pass the `errorMessagePath` option to retrieve the error message from the responses' body. You may pass it as a `defaultOptions` or as `options` at each request.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('http://www.mocky.io/v2', {
  errorMessagePath: 'message',
});

// http://www.mocky.io/v2/5e4ffabc3000005100226d1c
// {
//   "message": "Custom error",
//   ...
// }
client.get('/5e4ffabc3000005100226d1c').then(
  res => {},
  error => console.log(error.message) // Custom error
);
```

If the error message is deeply nested, you can use dot notation.

```js
// {
//   "data": {
//     "message": "Custom error",
//   }
// }

client.get('/5e4ffabc3000005100226d1c', { errorMessagePath: 'data.message' }).then(
  res => {},
  error => console.log(error.message)
);
```

### Handle Error Response with 200 Status Code

You might be using an API that returns 200 status code even if there's an error. To handle this kind of case, you may pass the `onSuccess` callback and throws an error if the received response is an error.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json', {
  onSuccess(res) {
    if (res.body.status !== true) {
      throw new Error('Status code 200 but throws error');
    }
  },
}).then(
  res => {},
  error => console.error(error.message)
);
```

### Force the Body to be Parsed as Other Data Types

By default this library will read and parsed the responses' body based on its header content-type:

- Content-type that contains `/json` or `+json` will be parsed as JSON object.
- Content-type that starts with `text/` will be parsed as text.
- Content-type that starts with `image/` will be parsed as a blob.

However, you may override this behavior by passing the `responseType` parameter. You may pass: `arrayBuffer`, `blob`, `formData`, `json`, or `text`.

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json', { responseType: 'blob' })
  .then(res => console.log(res.body));
```

## License

[MIT](https://github.com/risan/helpers/blob/master/LICENSE) © [Risan Bagja Pradana](https://risanb.com)
