// Implementación reutilizable de un cliente HTTP basado en fetch.

const IHttpClientService = require('./IHttpClientService');
const HttpClientException = require('./HttpClientException');

class HttpClientService extends IHttpClientService {
    // -----------------------------------------------------------------------------
    // constructor:
    // Recibe una URL base opcional y permite inyectar fetch para pruebas/adaptadores.
    // -----------------------------------------------------------------------------
    constructor({
        baseUrl = '',
        fetchImplementation = globalThis.fetch?.bind(globalThis)
    } = {}) {
        super();

        if (typeof fetchImplementation !== 'function') {
            throw new Error('HttpClientService requiere una implementación de fetch.');
        }

        this._baseUrl = this._normalizeBaseUrl(baseUrl);
        this._fetch = fetchImplementation;
    }

    // -----------------------------------------------------------------------------
    // requestAsync:
    // Construye, ejecuta y procesa una petición HTTP.
    // -----------------------------------------------------------------------------
    async requestAsync(
        method,
        address,
        {
            body = null,
            queryParams = null,
            bearerToken = null,
            headers = {},
            signal = null,
            ignoreResponseBody = false,
            includeResponseMetadata = false
        } = {}
    ) {
        const normalizedMethod = this._normalizeMethod(method);
        const normalizedAddress = this._validateAddress(address);
        const url = this._buildUrl(normalizedAddress, queryParams);
        const requestHeaders = this._buildHeaders(headers, bearerToken);
        const requestOptions = {
            method: normalizedMethod,
            headers: requestHeaders
        };

        if (signal) {
            requestOptions.signal = signal;
        }

        if (body !== null && body !== undefined) {
            const normalizedBody = this._normalizeBody(body);
            requestOptions.body = normalizedBody.body;

            if (normalizedBody.isJson) {
                this._setHeaderIfMissing(
                    requestHeaders,
                    'Content-Type',
                    'application/json'
                );
            }
        }

        let response;

        try {
            response = await this._fetch(url, requestOptions);
        } catch (error) {
            if (error?.name === 'AbortError' || signal?.aborted) {
                throw error;
            }

            throw new HttpClientException({
                message: `Error realizando ${normalizedMethod} a ${url}.`,
                url,
                method: normalizedMethod,
                responseBody: error?.message ?? null,
                cause: error
            });
        }

        if (!response.ok) {
            const responseBody = await this._tryReadBodyAsync(response);

            throw new HttpClientException({
                message:
                    `La petición ${normalizedMethod} a ${url} ` +
                    `falló con código ${response.status}.`,
                statusCode: response.status,
                url,
                method: normalizedMethod,
                responseBody
            });
        }

        if (ignoreResponseBody) {
            await this._discardResponseBodyAsync(response);
            return this._createResponseResult({
                response,
                data: null,
                includeResponseMetadata
            });
        }

        if (response.status === 204 || response.status === 205) {
            return this._createResponseResult({
                response,
                data: null,
                includeResponseMetadata
            });
        }

        const data = await this._deserializeResponseAsync(
            response,
            normalizedMethod,
            url
        );

        return this._createResponseResult({
            response,
            data,
            includeResponseMetadata
        });
    }

    async getAsync(address, options = {}) {
        return await this.requestAsync('GET', address, options);
    }

    async postAsync(address, body, options = {}) {
        return await this.requestAsync('POST', address, {
            ...options,
            body
        });
    }

    async putAsync(address, body, options = {}) {
        return await this.requestAsync('PUT', address, {
            ...options,
            body
        });
    }

    async patchAsync(address, body, options = {}) {
        return await this.requestAsync('PATCH', address, {
            ...options,
            body
        });
    }

    async deleteAsync(address, options = {}) {
        return await this.requestAsync('DELETE', address, options);
    }

    // -----------------------------------------------------------------------------
    // Helpers privados por convención del proyecto.
    // -----------------------------------------------------------------------------
    _normalizeBaseUrl(baseUrl) {
        if (typeof baseUrl !== 'string') {
            throw new Error('La URL base debe ser una cadena de texto.');
        }

        return baseUrl.trim().replace(/\/+$/, '');
    }

    _normalizeMethod(method) {
        if (typeof method !== 'string' || method.trim() === '') {
            throw new Error('El método HTTP es obligatorio.');
        }

        return method.trim().toUpperCase();
    }

    _validateAddress(address) {
        if (typeof address !== 'string' || address.trim() === '') {
            throw new Error('La dirección HTTP es obligatoria.');
        }

        return address.trim();
    }

    _buildUrl(address, queryParams) {
        const addressIsAbsolute = /^[a-z][a-z\d+.-]*:\/\//i.test(address);
        const normalizedAddress = addressIsAbsolute || !this._baseUrl
            ? address
            : `${this._baseUrl}/${address.replace(/^\/+/, '')}`;

        if (queryParams === null || queryParams === undefined) {
            return normalizedAddress;
        }

        if (
            typeof queryParams !== 'object' ||
            Array.isArray(queryParams)
        ) {
            throw new Error('Los parámetros de consulta deben ser un objeto.');
        }

        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(queryParams)) {
            if (value === null || value === undefined || value === '') {
                continue;
            }

            if (Array.isArray(value)) {
                continue;
            }

            const normalizedValue = value instanceof Date
                ? value.toISOString()
                : String(value);

            params.append(key, normalizedValue);
        }

        const queryString = params.toString();

        if (!queryString) {
            return normalizedAddress;
        }

        const hashIndex = normalizedAddress.indexOf('#');
        const addressWithoutHash = hashIndex >= 0
            ? normalizedAddress.slice(0, hashIndex)
            : normalizedAddress;
        const hash = hashIndex >= 0
            ? normalizedAddress.slice(hashIndex)
            : '';
        const separator = addressWithoutHash.includes('?') ? '&' : '?';

        return `${addressWithoutHash}${separator}${queryString}${hash}`;
    }

    _buildHeaders(headers, bearerToken) {
        if (
            headers === null ||
            typeof headers !== 'object' ||
            Array.isArray(headers)
        ) {
            throw new Error('Los encabezados HTTP deben ser un objeto.');
        }

        const requestHeaders = { ...headers };

        this._setHeaderIfMissing(requestHeaders, 'Accept', 'application/json');

        if (
            bearerToken !== null &&
            bearerToken !== undefined &&
            String(bearerToken).trim() !== ''
        ) {
            this._setHeader(
                requestHeaders,
                'Authorization',
                `Bearer ${String(bearerToken).trim()}`
            );
        }

        return requestHeaders;
    }

    _setHeaderIfMissing(headers, name, value) {
        const exists = Object.keys(headers).some(
            key => key.toLowerCase() === name.toLowerCase()
        );

        if (!exists) {
            headers[name] = value;
        }
    }

    _setHeader(headers, name, value) {
        for (const key of Object.keys(headers)) {
            if (key.toLowerCase() === name.toLowerCase()) {
                delete headers[key];
            }
        }

        headers[name] = value;
    }

    _normalizeBody(body) {
        if (this._isNativeBody(body)) {
            return {
                body,
                isJson: false
            };
        }

        return {
            body: JSON.stringify(body),
            isJson: true
        };
    }

    _isNativeBody(body) {
        if (typeof body === 'string') {
            return true;
        }

        const nativeBodyTypes = [
            globalThis.FormData,
            globalThis.Blob,
            globalThis.ArrayBuffer,
            globalThis.URLSearchParams,
            globalThis.ReadableStream
        ].filter(type => typeof type === 'function');

        if (nativeBodyTypes.some(type => body instanceof type)) {
            return true;
        }

        return ArrayBuffer.isView(body);
    }

    async _deserializeResponseAsync(response, method, url) {
        const contentType = response.headers.get('content-type') ?? '';
        const text = await response.text();

        if (!text) {
            return null;
        }

        if (contentType.toLowerCase().includes('application/json')) {
            try {
                return JSON.parse(text);
            } catch {
                throw new HttpClientException({
                    message:
                        'La respuesta fue exitosa pero no contiene JSON válido.',
                    statusCode: response.status,
                    url,
                    method,
                    responseBody: text
                });
            }
        }

        return text;
    }

    async _tryReadBodyAsync(response) {
        try {
            const text = await response.text();

            if (!text) {
                return null;
            }

            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        } catch {
            return null;
        }
    }

    async _discardResponseBodyAsync(response) {
        try {
            if (response.body?.cancel) {
                await response.body.cancel();
            }
        } catch {
            // Un error al descartar un body exitoso no cambia el resultado HTTP.
        }
    }

    _createResponseResult({
        response,
        data,
        includeResponseMetadata
    }) {
        if (!includeResponseMetadata) {
            return data;
        }

        const contentType = response.headers.get('content-type');

        return {
            data,
            httpStatusCode: response.status,
            responseContentType: contentType
                ? contentType.split(';')[0].trim()
                : null
        };
    }
}

module.exports = HttpClientService;
