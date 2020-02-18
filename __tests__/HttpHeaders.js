/* global expect:false, test:false */
import HttpHeaders from '../src/HttpHeaders';

test('it sets headers data as instance properties with lower case', () => {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'CACHE-CONTROL': 'no-cache, private',
  });

  expect(headers).toMatchObject({
    'content-type': 'application/json',
    'cache-control': 'no-cache, private',
  });
});

test('it can get header value', () => {
  const headers = new HttpHeaders({
    'content-type': 'application/json',
  });

  expect(headers.get('content-type')).toBe('application/json');
  expect(headers.get('Content-Type')).toBe('application/json');
  expect(headers.get('foo')).toBeNull();
  expect(headers.get('foo', 'bar')).toBe('bar');
});

test('it can check if header exists', () => {
  const headers = new HttpHeaders({
    'content-type': 'application/json',
  });

  expect(headers.has('content-type')).toBe(true);
  expect(headers.has('Content-Type')).toBe(true);
  expect(headers.has('foo')).toBe(false);
});

test('it can get content type', () => {
  const headers = new HttpHeaders({
    'content-type': 'application/json',
  });

  expect(headers.contentType()).toBe('application/json');
});

test('it can create an instance from native Headers object', () => {
  const nativeHeaders = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, private',
  });

  const headers = HttpHeaders.fromNativeHeaders(nativeHeaders);

  expect(headers).toBeInstanceOf(HttpHeaders);

  expect(headers).toMatchObject({
    'content-type': 'application/json',
    'cache-control': 'no-cache, private',
  });
});
