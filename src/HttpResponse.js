import HttpHeaders from './HttpHeaders';

const IMAGE_CONTENT_TYPE = /^image\//i;
const JSON_CONTENT_TYPE = /[/+]json/i;
const TEXT_CONTENT_TYPE = /^text\//i;

class HttpResponse {
  constructor(body = '', status = 200, headers = {}) {
    this.body = body;
    this.status = status;

    this.headers =
      headers instanceof HttpHeaders ? headers : new HttpHeaders(headers);
  }

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  }

  isError() {
    return this.status >= 400;
  }

  isOk() {
    return this.status === 200;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isValidationError() {
    return this.status === 422;
  }

  contentType() {
    return this.headers.get('content-type');
  }

  isImage() {
    return IMAGE_CONTENT_TYPE.test(this.contentType());
  }

  isJson() {
    return JSON_CONTENT_TYPE.test(this.contentType());
  }

  isText() {
    return TEXT_CONTENT_TYPE.test(this.contentType());
  }

  static async fromNativeResponse(response, responseType = undefined) {
    let body = null;
    const headers = HttpHeaders.fromNativeHeaders(response.headers);

    if (response.status === 204) {
      body = null;
    } else if (responseType) {
      body = await response[responseType]();
    } else if (JSON_CONTENT_TYPE.test(headers.contentType())) {
      body = await response.json();
    } else if (TEXT_CONTENT_TYPE.test(headers.contentType())) {
      body = await response.text();
    } else {
      body = await response.blob();
    }

    return new HttpResponse(body, response.status, headers);
  }
}

export default HttpResponse;
