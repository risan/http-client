/* global expect:false, test:false */
import HttpClient from '../src/HttpClient';

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
