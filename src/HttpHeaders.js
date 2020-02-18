import { dataGet, dataHas } from '@risan/helpers';

class HttpHeaders {
  constructor(headers = {}) {
    Object.keys(headers).forEach(key => {
      this[key.toLowerCase()] = headers[key];
    });
  }

  get(key, fallbackValue = null) {
    return dataGet(this, key.toLowerCase(), fallbackValue);
  }

  has(key) {
    return dataHas(this, key.toLowerCase());
  }

  contentType() {
    return this.get('content-type');
  }

  static fromNativeHeaders(headers) {
    const headersObj = {};

    headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    return new HttpHeaders(headersObj);
  }
}

export default HttpHeaders;
