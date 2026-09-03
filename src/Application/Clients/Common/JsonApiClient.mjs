import ApiClientError from './ApiClientError.mjs';

class JsonApiClient {
    constructor({
        baseUrl = '',
        fetchImplementation = globalThis.fetch?.bind(globalThis)
    } = {}) {
        if (typeof fetchImplementation !== 'function') {
            throw new Error(
                'JsonApiClient requiere una implementación de fetch.'
            );
        }

        this._baseUrl = String(baseUrl).replace(/\/$/, '');
        this._fetch = fetchImplementation;
    }

    async GetAsync(address, query = null) {
        return this.RequestAsync('GET', address, { query });
    }

    async PostAsync(address, body) {
        return this.RequestAsync('POST', address, { body });
    }

    async PutAsync(address, body) {
        return this.RequestAsync('PUT', address, { body });
    }

    async PatchAsync(address, body) {
        return this.RequestAsync('PATCH', address, { body });
    }

    async DeleteAsync(address) {
        return this.RequestAsync('DELETE', address);
    }

    async RequestAsync(
        method,
        address,
        { query = null, body = undefined } = {}
    ) {
        const url = this._buildUrl(address, query);
        const options = {
            method,
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            }
        };

        if (body !== undefined) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        let response;

        try {
            response = await this._fetch(url, options);
        } catch (error) {
            throw new ApiClientError({
                message: 'No fue posible comunicarse con la API.',
                cause: error
            });
        }

        const responseBody = await this._readBodyAsync(response);

        if (!response.ok) {
            throw new ApiClientError({
                message: 'La solicitud no pudo completarse.',
                statusCode: response.status,
                responseBody
            });
        }

        return responseBody;
    }

    _buildUrl(address, query) {
        const normalizedAddress = String(address).startsWith('/')
            ? String(address)
            : `/${address}`;

        const searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(query ?? {})) {
            if (
                value !== undefined &&
                value !== null &&
                value !== ''
            ) {
                searchParams.set(key, String(value));
            }
        }

        const queryString = searchParams.toString();

        return (
            `${this._baseUrl}${normalizedAddress}` +
            (queryString ? `?${queryString}` : '')
        );
    }

    async _readBodyAsync(response) {
        if (response.status === 204 || response.status === 205) {
            return null;
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
}

export default JsonApiClient;
