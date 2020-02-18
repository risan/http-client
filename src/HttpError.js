import HttpResponse from './HttpResponse';

class HttpError extends Error {
  constructor(message, response = null) {
    super(message);

    this.response = response;
  }

  hasResponse() {
    return this.response instanceof HttpResponse;
  }
}

export default HttpError;
