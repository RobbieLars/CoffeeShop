// ExternalCallResultEnum.js

const ExternalCallStatus = Object.freeze({
    SUCCESS: 1,
    PENDING: 2,
    FAILED: 3
});

const HttpContentType = Object.freeze({
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain"
});

const HttpMethod = Object.freeze({
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
});

const ExternalCallResultType = Object.freeze({
    SUMMARY: 1,
    DETAILED: 2
});

const ExternalCallErrorType = Object.freeze({
    NONE: 0,
    HTTP_ERROR: 1,
    NETWORK_ERROR: 2,
    TIMEOUT: 3,
    INVALID_RESPONSE: 4,
    UNKNOWN: 5
});

module.exports = {
    ExternalCallStatus,
    HttpContentType,
    HttpMethod,
    ExternalCallResultType,
    ExternalCallErrorType
};
