class ApiClientError extends Error {
    constructor({
        message,
        statusCode = null,
        responseBody = null,
        cause = null
    } = {}) {
        super(message);

        this.name = 'ApiClientError';
        this.statusCode = statusCode;
        this.responseBody = responseBody;

        if (cause) {
            this.cause = cause;
        }
    }
}

export default ApiClientError;
