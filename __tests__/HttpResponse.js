/* global expect:false, test:false */
import { Headers, Response } from 'whatwg-fetch';
import HttpResponse from '../src/HttpResponse';
import HttpHeaders from '../src/HttpHeaders';

test('it has body, status, and headers', () => {
  const response = new HttpResponse();

  expect(response.body).toBe('');
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
});

test('it can receive body, status, and headers parameters', () => {
  const response = new HttpResponse({ foo: 'bar' }, 201, {
    'content-type': 'application/json',
  });

  expect(response.body).toStrictEqual({ foo: 'bar' });
  expect(response.status).toBe(201);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('application/json');
});

test('it can receive HttpHeaders instance', () => {
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  const response = new HttpResponse({ foo: 'bar' }, 201, headers);

  expect(response.headers).toBe(headers);
});

test('it can check if response is success', () => {
  expect(new HttpResponse('', 200).isSuccess()).toBe(true);
  expect(new HttpResponse('', 201).isSuccess()).toBe(true);
  expect(new HttpResponse('', 204).isSuccess()).toBe(true);
  expect(new HttpResponse('', 400).isSuccess()).toBe(false);
  expect(new HttpResponse('', 401).isSuccess()).toBe(false);
  expect(new HttpResponse('', 403).isSuccess()).toBe(false);
  expect(new HttpResponse('', 404).isSuccess()).toBe(false);
  expect(new HttpResponse('', 422).isSuccess()).toBe(false);
  expect(new HttpResponse('', 500).isSuccess()).toBe(false);
  expect(new HttpResponse('', 502).isSuccess()).toBe(false);
});

test('it can check if response is error', () => {
  expect(new HttpResponse('', 200).isError()).toBe(false);
  expect(new HttpResponse('', 201).isError()).toBe(false);
  expect(new HttpResponse('', 203).isError()).toBe(false);
  expect(new HttpResponse('', 400).isError()).toBe(true);
  expect(new HttpResponse('', 401).isError()).toBe(true);
  expect(new HttpResponse('', 403).isError()).toBe(true);
  expect(new HttpResponse('', 404).isError()).toBe(true);
  expect(new HttpResponse('', 422).isError()).toBe(true);
  expect(new HttpResponse('', 500).isError()).toBe(true);
  expect(new HttpResponse('', 502).isError()).toBe(true);
});

test('it can check if response is ok', () => {
  expect(new HttpResponse('', 200).isOk()).toBe(true);
  expect(new HttpResponse('', 201).isOk()).toBe(false);
  expect(new HttpResponse('', 203).isOk()).toBe(false);
  expect(new HttpResponse('', 400).isOk()).toBe(false);
  expect(new HttpResponse('', 401).isOk()).toBe(false);
  expect(new HttpResponse('', 403).isOk()).toBe(false);
  expect(new HttpResponse('', 404).isOk()).toBe(false);
  expect(new HttpResponse('', 422).isOk()).toBe(false);
  expect(new HttpResponse('', 500).isOk()).toBe(false);
  expect(new HttpResponse('', 502).isOk()).toBe(false);
});

test('it can check if response is client error', () => {
  expect(new HttpResponse('', 200).isClientError()).toBe(false);
  expect(new HttpResponse('', 201).isClientError()).toBe(false);
  expect(new HttpResponse('', 203).isClientError()).toBe(false);
  expect(new HttpResponse('', 400).isClientError()).toBe(true);
  expect(new HttpResponse('', 401).isClientError()).toBe(true);
  expect(new HttpResponse('', 403).isClientError()).toBe(true);
  expect(new HttpResponse('', 404).isClientError()).toBe(true);
  expect(new HttpResponse('', 422).isClientError()).toBe(true);
  expect(new HttpResponse('', 500).isClientError()).toBe(false);
  expect(new HttpResponse('', 502).isClientError()).toBe(false);
});

test('it can check if response is server error', () => {
  expect(new HttpResponse('', 200).isServerError()).toBe(false);
  expect(new HttpResponse('', 201).isServerError()).toBe(false);
  expect(new HttpResponse('', 203).isServerError()).toBe(false);
  expect(new HttpResponse('', 400).isServerError()).toBe(false);
  expect(new HttpResponse('', 401).isServerError()).toBe(false);
  expect(new HttpResponse('', 403).isServerError()).toBe(false);
  expect(new HttpResponse('', 404).isServerError()).toBe(false);
  expect(new HttpResponse('', 422).isServerError()).toBe(false);
  expect(new HttpResponse('', 500).isServerError()).toBe(true);
  expect(new HttpResponse('', 502).isServerError()).toBe(true);
});

test('it can check if response is unauthorized', () => {
  expect(new HttpResponse('', 200).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 201).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 203).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 400).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 401).isUnauthorized()).toBe(true);
  expect(new HttpResponse('', 403).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 404).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 422).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 500).isUnauthorized()).toBe(false);
  expect(new HttpResponse('', 502).isUnauthorized()).toBe(false);
});

test('it can check if response is forbidden', () => {
  expect(new HttpResponse('', 200).isForbidden()).toBe(false);
  expect(new HttpResponse('', 201).isForbidden()).toBe(false);
  expect(new HttpResponse('', 203).isForbidden()).toBe(false);
  expect(new HttpResponse('', 400).isForbidden()).toBe(false);
  expect(new HttpResponse('', 401).isForbidden()).toBe(false);
  expect(new HttpResponse('', 403).isForbidden()).toBe(true);
  expect(new HttpResponse('', 404).isForbidden()).toBe(false);
  expect(new HttpResponse('', 422).isForbidden()).toBe(false);
  expect(new HttpResponse('', 500).isForbidden()).toBe(false);
  expect(new HttpResponse('', 502).isForbidden()).toBe(false);
});

test('it can check if response is not found', () => {
  expect(new HttpResponse('', 200).isNotFound()).toBe(false);
  expect(new HttpResponse('', 201).isNotFound()).toBe(false);
  expect(new HttpResponse('', 203).isNotFound()).toBe(false);
  expect(new HttpResponse('', 400).isNotFound()).toBe(false);
  expect(new HttpResponse('', 401).isNotFound()).toBe(false);
  expect(new HttpResponse('', 403).isNotFound()).toBe(false);
  expect(new HttpResponse('', 404).isNotFound()).toBe(true);
  expect(new HttpResponse('', 422).isNotFound()).toBe(false);
  expect(new HttpResponse('', 500).isNotFound()).toBe(false);
  expect(new HttpResponse('', 502).isNotFound()).toBe(false);
});

test('it can check if response is validation error', () => {
  expect(new HttpResponse('', 200).isValidationError()).toBe(false);
  expect(new HttpResponse('', 201).isValidationError()).toBe(false);
  expect(new HttpResponse('', 203).isValidationError()).toBe(false);
  expect(new HttpResponse('', 400).isValidationError()).toBe(false);
  expect(new HttpResponse('', 401).isValidationError()).toBe(false);
  expect(new HttpResponse('', 403).isValidationError()).toBe(false);
  expect(new HttpResponse('', 404).isValidationError()).toBe(false);
  expect(new HttpResponse('', 422).isValidationError()).toBe(true);
  expect(new HttpResponse('', 500).isValidationError()).toBe(false);
  expect(new HttpResponse('', 502).isValidationError()).toBe(false);
});

test('it can get content type', () => {
  const response = new HttpResponse({ foo: 'bar' }, 200, {
    'content-type': 'application/json',
  });

  expect(response.contentType()).toBe('application/json');
});

test('it can check if content type is image', () => {
  let response = new HttpResponse('', 200, { 'content-type': 'image/png' });
  expect(response.isImage()).toBe(true);

  response = new HttpResponse('', 200, { 'content-type': 'image/gif' });
  expect(response.isImage()).toBe(true);

  response = new HttpResponse('', 200, { 'content-type': 'application/json' });
  expect(response.isImage()).toBe(false);

  response = new HttpResponse('', 200, {
    'content-type': 'application/vnd.github+json',
  });
  expect(response.isImage()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'text/plain' });
  expect(response.isImage()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'text/html' });
  expect(response.isImage()).toBe(false);
});

test('it can check if content type is json', () => {
  let response = new HttpResponse('', 200, { 'content-type': 'image/png' });
  expect(response.isJson()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'image/gif' });
  expect(response.isJson()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'application/json' });
  expect(response.isJson()).toBe(true);

  response = new HttpResponse('', 200, {
    'content-type': 'application/vnd.github+json',
  });
  expect(response.isJson()).toBe(true);

  response = new HttpResponse('', 200, { 'content-type': 'text/plain' });
  expect(response.isJson()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'text/html' });
  expect(response.isJson()).toBe(false);
});

test('it can check if content type is text', () => {
  let response = new HttpResponse('', 200, { 'content-type': 'image/png' });
  expect(response.isText()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'image/gif' });
  expect(response.isText()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'application/json' });
  expect(response.isText()).toBe(false);

  response = new HttpResponse('', 200, {
    'content-type': 'application/vnd.github+json',
  });
  expect(response.isText()).toBe(false);

  response = new HttpResponse('', 200, { 'content-type': 'text/plain' });
  expect(response.isText()).toBe(true);

  response = new HttpResponse('', 200, { 'content-type': 'text/html' });
  expect(response.isText()).toBe(true);
});

test('native response with 204 status has no body', async () => {
  const response = await HttpResponse.fromNativeResponse(
    new Response('', { status: 204 })
  );

  expect(response.body).toBeNull();
  expect(response.status).toBe(204);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
});

test('native response with 204 status has no body', async () => {
  const response = await HttpResponse.fromNativeResponse(
    new Response('', { status: 204 })
  );

  expect(response.body).toBeNull();
  expect(response.status).toBe(204);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
});

test('it can create from native response with json content-type', async () => {
  const body = { foo: 'bar' };

  const response = await HttpResponse.fromNativeResponse(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
    })
  );

  expect(response.body).toStrictEqual(body);
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('application/json');
});

test('it can create from native response with text content-type', async () => {
  const response = await HttpResponse.fromNativeResponse(
    new Response('foo', {
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
    })
  );

  expect(response.body).toBe('foo');
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('text/plain');
});

test('other content-type will be parsed as blob', async () => {
  const body = new Blob(['foo']);

  const response = await HttpResponse.fromNativeResponse(
    new Response(body, {
      status: 200,
      headers: new Headers({ 'content-type': 'image/png' }),
    })
  );

  expect(response.body).toBeInstanceOf(Blob);
  expect(response.body).toBe(body);
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('image/png');
});

test('it can receive a custom response type', async () => {
  const body = { foo: 'bar' };

  let response = await HttpResponse.fromNativeResponse(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
    }),
    'text'
  );

  expect(response.body).toBe(JSON.stringify(body));
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('application/json');

  response = await HttpResponse.fromNativeResponse(
    new Response('foo', {
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
    }),
    'arrayBuffer'
  );

  expect(response.body).toBeInstanceOf(ArrayBuffer);
  expect(response.status).toBe(200);
  expect(response.headers).toBeInstanceOf(HttpHeaders);
  expect(response.headers['content-type']).toBe('text/plain');
});
