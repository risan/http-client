/* global expect:false, test:false */
import HttpError from '../src/HttpError';
import HttpResponse from '../src/HttpResponse';

test('it has message, response, and validationErrors properties', () => {
  const error = new HttpError('foo');

  expect(error).toHaveProperty('message');
  expect(error).toHaveProperty('response');
  expect(error).toHaveProperty('validationErrors');
});

test('it can check if it has response', () => {
  let error = new HttpError('foo');
  expect(error.hasResponse()).toBe(false);

  error = new HttpError('foo', new HttpResponse());
  expect(error.hasResponse()).toBe(true);
});

test('it can check if it has JSON body', () => {
  let response = new HttpResponse('foo', 200, {
    'content-type': 'text/plain',
  });
  let error = new HttpError('foo', response);
  expect(error.hasJsonBody()).toBe(false);

  response = new HttpResponse({ foo: 'bar' }, 200, {
    'content-type': 'application/json',
  });
  error = new HttpError('foo', response);
  expect(error.hasJsonBody()).toBe(true);
});

test('it can set error message from response', () => {
  const response = new HttpResponse({ message: 'bar' }, 200, {
    'content-type': 'application/json',
  });

  const error = new HttpError('foo', response, {
    errorMessagePath: 'message',
  });

  expect(error.message).toBe('bar');
});

test('it can set validation errors from response', () => {
  const errors = { email: ['error1', 'error2'] };

  let response = new HttpResponse({ errors }, 422, {
    'content-type': 'application/json',
  });

  let error = new HttpError('foo', response, {
    validationErrorsPath: 'errors',
  });

  expect(error.validationErrors).toBe(errors);
  expect(error.hasValidationErrors()).toBe(true);

  response = new HttpResponse({ errors: {} }, 422, {
    'content-type': 'application/json',
  });

  error = new HttpError('foo', response, {
    validationErrorsPath: 'errors',
  });

  expect(error.hasValidationErrors()).toBe(false);
});
