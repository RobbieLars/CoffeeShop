// ExternalCallResultDto.js

// DTO común para devolver resultados controlados
// provenientes de llamadas a APIs externas.

class ExternalCallResultDto {
    constructor({
        status,
        successful,
        data = null,
        message = null,
        httpStatusCode = null,
        externalService = null
    }) {
        this.status = status;
        this.successful = successful;
        this.data = data;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
        this.externalService = externalService;
    }
}


class ExternalCallDetailedResultDto {
    constructor({
        status,
        successful,
        externalService,
        requestMethod = null,
        requestContentType = null,
        responseContentType = null,
        requestData = null,
        data = null,
        message = null,
        httpStatusCode = null,
        elapsedTimeMs = null,
        errorType = null
    }) {
        this.status = status;
        this.successful = successful;
        this.externalService = externalService;
        this.requestMethod = requestMethod;
        this.requestContentType = requestContentType;
        this.responseContentType = responseContentType;
        this.requestData = requestData;
        this.data = data;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
        this.elapsedTimeMs = elapsedTimeMs;
        this.errorType = errorType;
    }
}

module.exports = {
    ExternalCallResultDto,
    ExternalCallDetailedResultDto
};
