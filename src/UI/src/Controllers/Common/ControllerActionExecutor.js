class ControllerActionExecutor {
    static PROVIDER_ERROR_MESSAGE =
        'Hubo un error de comunicación con el proveedor. Intente más tarde.';

    async ExecuteAsync(action) {
        if (typeof action !== 'function') {
            throw new TypeError(
                'ControllerActionExecutor requiere una acción.'
            );
        }

        try {
            const data = await action();

            return {
                successful: true,
                data,
                message: null,
                errors: null
            };
        } catch (error) {
            if (this._isKnownSourceError(error)) {
                return {
                    successful: false,
                    data: null,
                    message: this._getSourceMessage(error),
                    errors: this._getSourceErrors(error)
                };
            }

            return {
                successful: false,
                data: null,
                message:
                    ControllerActionExecutor.PROVIDER_ERROR_MESSAGE,
                errors: null
            };
        }
    }

    // Error HTTP respondido por la API o error controlado del mock.
    _isKnownSourceError(error) {
        const hasHttpStatus =
            Number.isInteger(error?.statusCode);

        const hasApplicationCode =
            typeof error?.code === 'string' &&
            error.code.trim() !== '';

        return hasHttpStatus || hasApplicationCode;
    }

    _getSourceMessage(error) {
        const responseBody = error?.responseBody;

        // Respuesta JSON de la API:
        // { message: 'Mascota no encontrada.' }
        if (
            responseBody &&
            typeof responseBody === 'object' &&
            typeof responseBody.message === 'string' &&
            responseBody.message.trim() !== ''
        ) {
            return responseBody.message;
        }

        // Respuesta de texto de la API.
        if (
            typeof responseBody === 'string' &&
            responseBody.trim() !== ''
        ) {
            return responseBody;
        }

        // Errores controlados de una fuente mock.
        if (
            typeof error?.message === 'string' &&
            error.message.trim() !== ''
        ) {
            return error.message;
        }

        return 'La solicitud no pudo completarse.';
    }

    _getSourceErrors(error) {
        const responseBody = error?.responseBody;

        if (
            responseBody &&
            typeof responseBody === 'object'
        ) {
            return responseBody.errors ?? null;
        }

        return error?.errors ?? error?.details ?? null;
    }
}

export default ControllerActionExecutor;