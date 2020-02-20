/* global beforeEach:false, expect:false, jest:false, test:false */
import ky from 'ky';
import { Response } from 'whatwg-fetch';
import HttpClient from '../src/HttpClient';
import HttpError from '../src/HttpError';
import HttpHeaders from '../src/HttpHeaders';
import HttpResponse from '../src/HttpResponse';

jest.mock('ky');

beforeEach(() => {
  ky.mockClear();
});

test('it has prefixUrl and defaultOptions properties', () => {
  const client = new HttpClient('http://example.com');

  expect(client.prefixUrl).toBe('http://example.com');
  expect(client.defaultOptions).toStrictEqual({});
});

test('it can receive defaultOptions', () => {
  const defaultOptions = {
    headers: {
      'content-type': 'application/json',
    },
  };

  const client = new HttpClient('http://example.com', defaultOptions);

  expect(client.defaultOptions).toBe(defaultOptions);
});

test('it can set default option', () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      'content-type': 'application/json',
    },
  });

  expect(client.setDefaultOption('mode', 'cors')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'application/json',
    },
    mode: 'cors',
  });

  expect(client.setDefaultOption('headers.content-type', 'text/plain')).toBe(
    client
  );
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'text/plain',
    },
    mode: 'cors',
  });
});

test('it can remove default option', () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
    },
  });

  expect(client.removeDefaultOption('mode', 'cors')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'application/json',
    },
  });

  expect(client.removeDefaultOption('headers.content-type', 'text/plain')).toBe(
    client
  );
  expect(client.defaultOptions).toStrictEqual({
    headers: {},
  });
});

test('it can set default header', () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      'content-type': 'application/json',
    },
  });

  expect(client.setDefaultHeader('content-type', 'text/plain')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'text/plain',
    },
  });

  expect(client.setDefaultHeader('foo', 'bar')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'text/plain',
      foo: 'bar',
    },
  });
});

test('it can remove default header', () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      'content-type': 'application/json',
      foo: 'bar',
    },
  });

  expect(client.removeDefaultHeader('content-type')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      foo: 'bar',
    },
  });
});

test('it can set default bearer token', () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      'content-type': 'application/json',
    },
  });

  expect(client.setDefaultBearerToken('secret')).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      authorization: 'Bearer secret',
      'content-type': 'application/json',
    },
  });
});

test('it can remove default bearer token', () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      authorization: 'Bearer secret',
      'content-type': 'application/json',
    },
  });

  expect(client.removeDefaultBearerToken()).toBe(client);
  expect(client.defaultOptions).toStrictEqual({
    headers: {
      'content-type': 'application/json',
    },
  });
});

test('it can merge options', () => {
  const client = new HttpClient('http://example.com', {
    mode: 'same-origin',
    headers: {
      'content-type': 'application/json',
      foo: 'bar',
    },
  });

  expect(
    client.mergeOptions({
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        BAZ: 'qux',
      },
    })
  ).toStrictEqual({
    mode: 'cors',
    method: 'POST',
    headers: {
      accept: ['application/json', 'text/plain'],
      'content-type': 'text/plain',
      foo: 'bar',
      baz: 'qux',
    },
  });
});

test("if body is not a plain object, it won't be parsed", () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
  });

  let options = {
    body: JSON.stringify([1, 2]),
    headers: {
      'content-type': 'application/json',
    },
  };

  expect(client.requestOptions(options)).toMatchObject({
    mode: 'cors',
    ...options,
  });

  options = {
    body: new URLSearchParams(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  };

  expect(client.requestOptions(options)).toMatchObject({
    mode: 'cors',
    ...options,
  });

  options = {
    body: new FormData(),
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  expect(client.requestOptions(options)).toMatchObject({
    mode: 'cors',
    ...options,
  });
});

test("if body is empty, it won't be parsed", () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
  });

  const options = {
    body: {},
    headers: {
      'content-type': 'application/json',
    },
  };

  expect(client.requestOptions(options)).toMatchObject({
    mode: 'cors',
    ...options,
  });
});

test('it can transform plain object to FormData for form-data content type', () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
  });

  const options = client.requestOptions({
    body: { foo: 'bar' },
    headers: {
      accept: 'text/plain',
      'content-type': 'multipart/form-data',
    },
  });

  expect(options.body).toBeInstanceOf(FormData);
  expect(options.body.get('foo')).toBe('bar');
  expect(options.headers['content-type']).toBeUndefined();
  expect(options.headers.accept).toBe('text/plain');
  expect(options.mode).toBe('cors');
});

test('it can transform plain object to URLSearchParams for form-urlencoded content type', () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
  });

  const options = client.requestOptions({
    body: { foo: 'bar' },
    headers: {
      accept: 'text/plain',
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  expect(options.body).toBeInstanceOf(URLSearchParams);
  expect(options.body.get('foo')).toBe('bar');
  expect(options.headers['content-type']).toBeUndefined();
  expect(options.headers.accept).toBe('text/plain');
  expect(options.mode).toBe('cors');
});

test('it returns json property for other content types', () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
  });

  const options = client.requestOptions({
    body: { foo: 'bar' },
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
    },
  });

  expect(options.body).toBeUndefined();
  expect(options.json).toStrictEqual({ foo: 'bar' });
  expect(options.headers['content-type']).toBe('application/json');
  expect(options.headers.accept).toBe('text/plain');
  expect(options.mode).toBe('cors');
});

test('it can send http request', async () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
    headers: {
      accept: 'application/json',
    },
  });

  const response = new Response(JSON.stringify({ foo: 'bar' }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockResolvedValue(response);

  const result = await client.request('GET', '/test');

  expect(ky).toHaveBeenCalledWith('test', {
    body: undefined,
    mode: 'cors',
    method: 'GET',
    prefixUrl: 'http://example.com',
    headers: {
      accept: 'application/json',
    },
  });

  expect(result).toBeInstanceOf(HttpResponse);
  expect(result.status).toBe(200);
  expect(result.body).toStrictEqual({ foo: 'bar' });
  expect(result.headers).toBeInstanceOf(HttpHeaders);
  expect(result.headers['content-type']).toBe('application/json');
});

test('it can receive responseType parameter', async () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
    headers: {
      accept: 'application/json',
    },
  });

  const response = new Response(JSON.stringify({ foo: 'bar' }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockResolvedValue(response);

  const result = await client.request('GET', '/test', {
    responseType: 'text',
  });

  expect(result).toBeInstanceOf(HttpResponse);
  expect(result.status).toBe(200);
  expect(result.body).toBe(JSON.stringify({ foo: 'bar' }));
});

test('it can receive onSuccess parameter', async () => {
  const client = new HttpClient('http://example.com', {
    mode: 'cors',
    headers: {
      accept: 'application/json',
    },
  });

  const response = new Response(JSON.stringify({ foo: 'bar' }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockResolvedValue(response);

  const { fromNativeResponse } = HttpResponse;
  HttpResponse.fromNativeResponse = jest.fn();
  HttpResponse.fromNativeResponse.mockResolvedValue('source response');

  const onSuccess = jest.fn();

  onSuccess.mockReturnValue('custom response');

  const result = await client.request('GET', '/test', {
    onSuccess,
  });

  expect(onSuccess).toHaveBeenCalledWith('source response');
  expect(result).toBe('custom response');

  HttpResponse.fromNativeResponse = fromNativeResponse;
});

test('it throws HttpError if status code >= 400', async () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      accept: 'application/json',
    },
  });

  const kyError = new Error('Bad request');

  kyError.response = new Response(JSON.stringify({ message: 'ooops' }), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockRejectedValue(kyError);

  expect.assertions(5);

  try {
    await client.request('GET', '/test');
  } catch (error) {
    expect(error).toBeInstanceOf(HttpError);
    expect(error.message).toBe('Bad request');
    expect(error.response).toBeInstanceOf(HttpResponse);
    expect(error.response.status).toBe(400);
    expect(error.response.body).toStrictEqual({ message: 'ooops' });
  }
});

test('it can receive errorMessagePath', async () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      accept: 'application/json',
    },
  });

  const kyError = new Error('Bad request');

  kyError.response = new Response(JSON.stringify({ message: 'ooops' }), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockRejectedValue(kyError);

  expect.assertions(2);

  try {
    await client.request('GET', '/test', {
      errorMessagePath: 'message',
    });
  } catch (error) {
    expect(error).toBeInstanceOf(HttpError);
    expect(error.message).toBe('ooops');
  }
});

test('it can receive validationErrorsPath', async () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      accept: 'application/json',
    },
  });

  const kyError = new Error('Bad request');

  const errors = {
    email: ['error1', 'error2'],
  };

  kyError.response = new Response(JSON.stringify({ errors }), {
    status: 422,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockRejectedValue(kyError);

  expect.assertions(3);

  try {
    await client.request('GET', '/test', {
      validationErrorsPath: 'errors',
    });
  } catch (error) {
    expect(error).toBeInstanceOf(HttpError);
    expect(error.hasValidationErrors()).toBe(true);
    expect(error.validationErrors).toStrictEqual(errors);
  }
});

test('it can receive onError function', async () => {
  const client = new HttpClient('http://example.com', {
    headers: {
      accept: 'application/json',
    },
  });

  const kyError = new Error('Bad request');

  kyError.response = new Response(JSON.stringify({ message: 'ooops' }), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  });

  ky.mockRejectedValue(kyError);

  const onError = jest.fn();

  onError.mockReturnValue('custom response');

  const result = await client.request('GET', '/test', { onError });

  expect(result).toBe('custom response');
});

test('it can send GET request', async () => {
  const client = new HttpClient('http://example.com');

  client.request = jest.fn();
  client.request.mockResolvedValue('response');

  const response = await client.get('/test', { mode: 'cors' });

  expect(client.request).toHaveBeenCalledWith('GET', '/test', { mode: 'cors' });
  expect(response).toBe('response');
});

test('it can send POST request', async () => {
  const client = new HttpClient('http://example.com');

  client.request = jest.fn();
  client.request.mockResolvedValue('response');

  const response = await client.post('/test', { foo: 'bar' }, { mode: 'cors' });

  expect(client.request).toHaveBeenCalledWith('POST', '/test', {
    mode: 'cors',
    body: { foo: 'bar' },
  });
  expect(response).toBe('response');
});

test('it can send PUT request', async () => {
  const client = new HttpClient('http://example.com');

  client.request = jest.fn();
  client.request.mockResolvedValue('response');

  const response = await client.put('/test', { foo: 'bar' }, { mode: 'cors' });

  expect(client.request).toHaveBeenCalledWith('PUT', '/test', {
    mode: 'cors',
    body: { foo: 'bar' },
  });
  expect(response).toBe('response');
});

test('it can send PATCH request', async () => {
  const client = new HttpClient('http://example.com');

  client.request = jest.fn();
  client.request.mockResolvedValue('response');

  const response = await client.patch(
    '/test',
    { foo: 'bar' },
    { mode: 'cors' }
  );

  expect(client.request).toHaveBeenCalledWith('PATCH', '/test', {
    mode: 'cors',
    body: { foo: 'bar' },
  });
  expect(response).toBe('response');
});

test('it can send DELETE request', async () => {
  const client = new HttpClient('http://example.com');

  client.request = jest.fn();
  client.request.mockResolvedValue('response');

  const response = await client.delete('/test', { mode: 'cors' });

  expect(client.request).toHaveBeenCalledWith('DELETE', '/test', {
    mode: 'cors',
  });
  expect(response).toBe('response');
});
