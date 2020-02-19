import ky from 'ky';
import { dataSet, dataRemove, isFunction, lowerCaseKeys } from '@risan/helpers';
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

  async request(method, url, options = {}) {
    const {
      responseType,
      onError,
      onSuccess,
      errorMessagePath,
      validationErrorsPath,
      ...mergedOptions
    } = this.mergeOptions(options);

    try {
      const response = await ky(url.replace(/^\//, ''), {
        ...mergedOptions,
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
}

export default HttpClient;
