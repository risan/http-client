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

const client = new HttpClient('http://example.com');

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

### `HttpClient()`

Create a new `HttpClient` instance.

```js
new HttpClient(prefixUrl, defaultOptions = {})
```

- `prefixUrl`: A prefix to prepend to the URL when making the request.
- `defaultOptions`: A default options to use when making the request, check [Options](#options) for more detail.

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

### `HttpClient.request()`

Send HTTP request.

```js
HttpClient.request(method, url, options = {});
```

### `HttpClient.get()`

Send HTTP GET request.

```js
HttpClient.get(url, options = {});
```

### `HttpClient.post()`

Send HTTP POST request.

```js
HttpClient.post(url, body = null, options = {});
```

### `HttpClient.put()`

Send HTTP PUT request.

```js
HttpClient.put(url, body = null, options = {});
```

### `HttpClient.patch()`

Send HTTP PATCH request.

```js
HttpClient.patch(url, body = null, options = {});
```

### `HttpClient.delete()`

Send HTTP DELETE request.

```js
HttpClient.delete(url, options = {});
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
