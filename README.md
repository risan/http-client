# HTTP Client

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
  .then(response => console.log(response.body));

client.post('/post', { foo: 'bar' })
  .then(response => console.log(response.body));
```

## API

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

- [`HttpResponse.body`](httpresponsebody)
- [`HttpResponse.status`](httpresponsestatus)
- [`HttpResponse.headers`](httpresponseheaders)
- [`HttpResponse.isSuccess()`](httpresponseissuccess)
- [`HttpResponse.isError()`](httpresponseiserror)

### `HttpClient`

#### `HttpClient()`

Create a new `HttpClient` instance.

```js
new HttpClient(prefixUrl, defaultOptions = {})
```

- `prefixUrl`: A prefix to prepend to the URL when making the request.
- `defaultOptions`: A default options to use when making the request, check [Options](#options) for more detail.

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
  onSuccess(response) {
    console.log(response.body);

    return 'custom result';
  },
});
```

#### Options

The request's options are similar to [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) with slight differences:

- `headers`: Unlike `fetch()`, it only accepts an object literal.
- `credentials`: Default to `same-origin`.

It also accepts a similar options as [`ky`](https://github.com/sindresorhus/ky#options):

- [`searchParams`](https://github.com/sindresorhus/ky#searchparams): Search parameters to include in the request URL.
- [`retry`](https://github.com/sindresorhus/ky#retry): Maximum retry count.
- [`timeout`](https://github.com/sindresorhus/ky#timeout): Timeout in milliseconds for getting a response.
- [`hooks`](https://github.com/sindresorhus/ky#hooks): Hooks allow modifications during the request lifecycle.
- [`throwHttpErrors`](https://github.com/sindresorhus/ky#throwhttperrors): Throws an error for a non-2xx response, default to `true`.
- [`onDownloadProgress`](https://github.com/sindresorhus/ky#ondownloadprogress): Download progress event handler.

As addition, it also accept the following options:

- `onError`: A callback function to call when an error response is received.
- `onSuccess`: A callback function to call when an successful response is received.
- `responseType`: Response's body type (`arrayBuffer`, `blob`, `formData`, `json`, or `text`).
- `errorMessagePath`: A path to a custom error message.
- `validationErrorsPath`: A path to a custom validation errors detail.

#### `HttpClient.request()`

Send HTTP request to `url` with the given HTTP `method`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.request(method, url, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.request('GET', '/json', {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.get()`

Send HTTP GET request to `url`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.get(url, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json', {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.post()`

Send HTTP POST request with `body` to `url`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.post(url, body = null, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.post('/post', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.put()`

Send HTTP PUT request with `body` to `url`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.put(url, body = null, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.put('/put', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.patch()`

Send HTTP PATCH request with `body` to `url`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.patch(url, body = null, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.patch('/patch', { foo: 'bar' }, {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.delete()`

Send HTTP DELETE request to `url`. The given [`options`](#options) will be merged with the previously set `defaultOptions`.

```js
HttpClient.delete(url, options = {});
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.delete('/delete', {
  headers: {
    accept: 'application/json',
  },
}).then(response => console.log(response.body));
```

#### `HttpClient.setDefaultOption()`

Set a default option at `key` with `value`. This method returns the `HttpClient` instance itself.

```js
HttpClient.setDefaultOption(key, value);
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
HttpClient.removeDefaultOption(key);
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
HttpClient.setDefaultHeader(key, value);
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
HttpClient.removeDefaultHeader(key);
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
HttpClient.setDefaultBearerToken(token);
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
HttpClient.removeDefaultBearerToken();
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

Get the response's body.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

// If response's content-type is application/json, response.body will be
// automatically parsed to object.
client.get('/json')
  .then(response => console.log(response.body));
```

#### `HttpResponse.status`

Get the response's status code.

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/204')
  .then(response => console.log(response.status)); // 204
```

#### `HttpResponse.headers`

Get the response's headers, it's an instance of [`HttpHeaders`](#httpheaders).

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/json').then(response => {
  console.log(response.headers.has('content-type')); // true
  console.log(response.headers.get('content-type')); // application/json
  console.log(response.headers['content-type']);     // application/json
});
```

#### `HttpResponse.isSuccess()`

Check if the received `HttpResponse` instance is successful (status code between 200—299).

```js
HttpResponse.isSuccess();
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/200')
  .then(response => console.log(response.isSuccess())); // true

client.get('/status/400').then(
  response => {},
  error => console.log(error.response.isSuccess()) // false
);
```

#### `HttpResponse.isError()`

Check if the received `HttpResponse` instance is error (status code >= 400).

```js
HttpResponse.isError();
```

```js
import HttpClient from '@/risan/http-client';

const client = new HttpClient('https://httpbin.org');

client.get('/status/200')
  .then(response => console.log(response.isError())); // false

client.get('/status/400').then(
  response => {},
  error => console.log(error.response.isError()) // true
);
```

## Guide

### Set Default Headers

```js
import HttpClient from '@risan/http-client';

const client = new HttpClient('http://example.com', {
  headers: {
    accept: 'application/json',
  },
});

client.get('/json').then(response => console.log(response.body));

// Override default accept headers.
client.get('/html', {
  headers: {
    accept: 'text/html',
  },
}).then(response => console.log(response.body));
```

## License

[MIT](https://github.com/risan/helpers/blob/master/LICENSE) © [Risan Bagja Pradana](https://risanb.com)
