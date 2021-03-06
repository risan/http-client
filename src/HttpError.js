import { dataGet, isEmpty, isObject, isString } from '@risan/helpers';
import HttpResponse from './HttpResponse';

class HttpError extends Error {
  constructor(
    message,
    response = null,
    { errorMessagePath, validationErrorsPath } = {}
  ) {
    super(message);

    this.response = response;
    this.validationErrors = null;

    if (this.hasJsonBody() && errorMessagePath) {
      const errorMessage = dataGet(response.body, errorMessagePath);

      if (isString(errorMessage) && !isEmpty(errorMessage)) {
        this.message = errorMessage;
      }
    }

    if (
      this.hasJsonBody() &&
      response.isValidationError() &&
      validationErrorsPath
    ) {
      const errors = dataGet(response.body, validationErrorsPath);

      if (isObject(errors) && !isEmpty(errors)) {
        this.validationErrors = errors;
      }
    }
  }

  hasResponse() {
    return this.response instanceof HttpResponse;
  }

  hasJsonBody() {
    return this.hasResponse() && isObject(this.response.body);
  }

  hasValidationErrors() {
    return isObject(this.validationErrors) && !isEmpty(this.validationErrors);
  }
}

export default HttpError;
