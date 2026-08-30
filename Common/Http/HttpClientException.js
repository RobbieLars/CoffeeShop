// Error normalizado producido por el cliente HTTP común.

class HttpClientException extends Error {
    constructor({
        message,
        statusCode = null,
        url,
        method,
        responseBody = null,
        cause = null
    } = {}) {
        super(message);

        this.name = 'HttpClientException';
        this.statusCode = statusCode;
        this.url = url;
        this.method = method;
        this.responseBody = responseBody;

        if (cause) {
            this.cause = cause;
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpClientException);
        }
    }
}

module.exports = HttpClientException;
