// Ejecuta llamadas externas y las convierte en resultados controlados.

const IExternalCallExecutorService = require(
    './IExternalCallExecutorService'
);
const HttpClientException = require('./HttpClientException');

const {
    ExternalCallResultDto,
    ExternalCallDetailedResultDto
} = require('../DTOs/ExternalCallDto');

const {
    ExternalCallStatus,
    ExternalCallResultType,
    ExternalCallErrorType,
    HttpMethod
} = require('../Enum/ExternalCallEnum');

class ExternalCallExecutorService extends IExternalCallExecutorService {
    constructor({ httpClientService } = {}) {
        super();

        if (typeof httpClientService?.requestAsync !== 'function') {
            throw new Error(
                'ExternalCallExecutorService requiere HttpClientService.'
            );
        }

        this._httpClient = httpClientService;
    }

    async executeAsync({
        externalService,
        address,
        requestMethod,
        resultType = ExternalCallResultType.SUMMARY,
        requestContentType = null,
        responseContentType = null,
        requestData = null,
        requestOptions = {},
        successMessage = null,
        failureMessage = null
    } = {}) {
        this._validateExecution({
            externalService,
            address,
            requestMethod,
            resultType,
            requestOptions
        });

        const startedAt = Date.now();

        try {
            const response = await this._httpClient.requestAsync(
                requestMethod,
                address,
                this._buildRequestOptions({
                    requestMethod,
                    requestContentType,
                    responseContentType,
                    requestData,
                    requestOptions
                })
            );
            const status = response.httpStatusCode === 202
                ? ExternalCallStatus.PENDING
                : ExternalCallStatus.SUCCESS;
            const commonResult = {
                status,
                successful: true,
                data: response.data,
                message:
                    successMessage ??
                    this._extractMessage(response.data) ??
                    'Consulta externa realizada correctamente.',
                httpStatusCode: response.httpStatusCode,
                externalService
            };

            return this._createResult({
                commonResult,
                resultType,
                requestMethod,
                requestContentType,
                responseContentType:
                    response.responseContentType ?? responseContentType,
                requestData,
                responseData: response.data,
                elapsedTimeMs: Date.now() - startedAt,
                errorType: ExternalCallErrorType.NONE
            });
        } catch (error) {
            if (!this._isControlledExternalError(error)) {
                throw error;
            }

            const responseData = error.responseBody ?? null;
            const commonResult = {
                status: ExternalCallStatus.FAILED,
                successful: false,
                data: null,
                message:
                    failureMessage ??
                    this._extractMessage(responseData) ??
                    error.message ??
                    'No fue posible completar la consulta externa.',
                httpStatusCode: error.statusCode ?? null,
                externalService
            };

            return this._createResult({
                commonResult,
                resultType,
                requestMethod,
                requestContentType,
                responseContentType,
                requestData,
                responseData,
                elapsedTimeMs: Date.now() - startedAt,
                errorType: this._resolveErrorType(error)
            });
        }
    }

    _validateExecution({
        externalService,
        address,
        requestMethod,
        resultType,
        requestOptions
    }) {
        if (
            typeof externalService !== 'string' ||
            externalService.trim() === ''
        ) {
            throw new Error('El servicio externo es obligatorio.');
        }

        if (typeof address !== 'string' || address.trim() === '') {
            throw new Error('La direccion HTTP es obligatoria.');
        }

        if (!Object.values(HttpMethod).includes(requestMethod)) {
            throw new Error('El metodo HTTP indicado no es valido.');
        }

        if (!Object.values(ExternalCallResultType).includes(resultType)) {
            throw new Error('El tipo de resultado externo no es valido.');
        }

        if (
            requestOptions === null ||
            typeof requestOptions !== 'object' ||
            Array.isArray(requestOptions)
        ) {
            throw new Error('Las opciones HTTP deben ser un objeto.');
        }
    }

    _buildRequestOptions({
        requestMethod,
        requestContentType,
        responseContentType,
        requestData,
        requestOptions
    }) {
        const options = {
            ...requestOptions,
            headers: {
                ...(requestOptions.headers ?? {})
            },
            includeResponseMetadata: true
        };

        this._setHeaderIfMissing(
            options.headers,
            'Content-Type',
            requestContentType
        );
        this._setHeaderIfMissing(
            options.headers,
            'Accept',
            responseContentType
        );

        const supportsBody = [
            HttpMethod.POST,
            HttpMethod.PUT,
            HttpMethod.PATCH,
            HttpMethod.DELETE
        ].includes(requestMethod);
        const hasExplicitBody = Object.prototype.hasOwnProperty.call(
            requestOptions,
            'body'
        );

        if (supportsBody && !hasExplicitBody && requestData !== null) {
            options.body = requestData;
        }

        return options;
    }

    _setHeaderIfMissing(headers, name, value) {
        if (value === null || value === undefined || value === '') {
            return;
        }

        const exists = Object.keys(headers).some(
            key => key.toLowerCase() === name.toLowerCase()
        );

        if (!exists) {
            headers[name] = value;
        }
    }

    _createResult({
        commonResult,
        resultType,
        requestMethod,
        requestContentType,
        responseContentType,
        requestData,
        responseData,
        elapsedTimeMs,
        errorType
    }) {
        if (resultType === ExternalCallResultType.DETAILED) {
            return new ExternalCallDetailedResultDto({
                status: commonResult.status,
                successful: commonResult.successful,
                externalService: commonResult.externalService,
                requestMethod,
                requestContentType,
                responseContentType,
                requestData,
                data: responseData,
                message: commonResult.message,
                httpStatusCode: commonResult.httpStatusCode,
                elapsedTimeMs,
                errorType
            });
        }

        return new ExternalCallResultDto(commonResult);
    }

    _extractMessage(data) {
        if (
            data !== null &&
            typeof data === 'object' &&
            typeof data.message === 'string' &&
            data.message.trim() !== ''
        ) {
            return data.message;
        }

        return null;
    }

    _isControlledExternalError(error) {
        return (
            error instanceof HttpClientException ||
            error?.name === 'HttpClientException' ||
            error?.name === 'AbortError'
        );
    }

    _resolveErrorType(error) {
        if (error?.name === 'AbortError') {
            return ExternalCallErrorType.TIMEOUT;
        }

        if (error?.statusCode !== null && error?.statusCode !== undefined) {
            const invalidResponse =
                error.statusCode >= 200 && error.statusCode < 300;

            return invalidResponse
                ? ExternalCallErrorType.INVALID_RESPONSE
                : ExternalCallErrorType.HTTP_ERROR;
        }

        if (error instanceof HttpClientException) {
            return ExternalCallErrorType.NETWORK_ERROR;
        }

        return ExternalCallErrorType.UNKNOWN;
    }
}

module.exports = ExternalCallExecutorService;
