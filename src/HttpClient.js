import ky from 'ky';
import {
  dataGet,
  dataSet,
  dataRemove,
  isEmpty,
  isFunction,
  isPlainObject,
  lowerCaseKeys,
} from '@risan/helpers';
import HttpError from './HttpError';
import HttpResponse from './HttpResponse';

class HttpClient {
  constructor(prefixUrl, defaultOptions = {}) {
    this.prefixUrl = prefixUrl;
    this.defaultOptions = defaultOptions;
  }

  get(url, options = {}) {
    return this.request('GET', url, options);
  }

  post(url, body = null, options = {}) {
    return this.request('POST', url, {
      ...options,
      body,
    });
  }

  put(url, body = null, options = {}) {
    return this.request('PUT', url, {
      ...options,
      body,
    });
  }

  patch(url, body = null, options = {}) {
    return this.request('PATCH', url, {
      ...options,
      body,
    });
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, options);
  }

  async request(method, url, options = {}) {
    const {
      responseType,
      onError,
      onSuccess,
      errorMessagePath,
      validationErrorsPath,
      ...requestOptions
    } = this.requestOptions(options);

    try {
      const response = await ky(url.replace(/^\//, ''), {
        ...requestOptions,
        method,
        prefixUrl: this.prefixUrl,
      });

      const httpResponse = await HttpResponse.fromNativeResponse(
        response,
        responseType
      );

      return isFunction(onSuccess) ? onSuccess(httpResponse) : httpResponse;
    } catch (error) {
      const response = error.response
        ? await HttpResponse.fromNativeResponse(error.response)
        : null;

      const httpError = new HttpError(error.message, response, {
        errorMessagePath,
        validationErrorsPath,
      });

      if (isFunction(onError)) {
        return onError(httpError);
      }

      throw httpError;
    }
  }

  setDefaultOption(key, value) {
    dataSet(this.defaultOptions, key, value);

    return this;
  }

  removeDefaultOption(key) {
    dataRemove(this.defaultOptions, key);

    return this;
  }

  setDefaultHeader(key, value) {
    return this.setDefaultOption(`headers.${key}`, value);
  }

  removeDefaultHeader(key) {
    return this.removeDefaultOption(`headers.${key}`);
  }

  setDefaultBearerToken(token) {
    return this.setDefaultHeader('authorization', `Bearer ${token}`);
  }

  removeDefaultBearerToken() {
    return this.removeDefaultHeader('authorization');
  }

  mergeOptions(options = {}) {
    const {
      headers: defaultHeaders = {},
      ...otherDefaultOptions
    } = this.defaultOptions;
    const { headers = {}, ...otherOptions } = options;

    return {
      ...otherDefaultOptions,
      ...otherOptions,
      headers: {
        accept: ['application/json', 'text/plain'],
        ...lowerCaseKeys(defaultHeaders),
        ...lowerCaseKeys(headers),
      },
    };
  }

  requestOptions(options = {}) {
    const { body, ...mergedOptions } = this.mergeOptions(options);

    if (!isPlainObject(body) || isEmpty(body)) {
      return { body, ...mergedOptions };
    }

    const contentType = dataGet(
      mergedOptions,
      'headers.content-type',
      ''
    ).toLowerCase();

    if (contentType.includes('multipart/form-data')) {
      const formData = new FormData();

      Object.keys(body).forEach(key => {
        formData.append(key, body[key]);
      });

      dataRemove(mergedOptions, 'headers.content-type');

      return { body: formData, ...mergedOptions };
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const searchParams = new URLSearchParams();

      Object.keys(body).forEach(key => {
        searchParams.set(key, body[key]);
      });

      dataRemove(mergedOptions, 'headers.content-type');

      return { body: searchParams, ...mergedOptions };
    }

    return { json: body, ...mergedOptions };
  }
}

export default HttpClient;
