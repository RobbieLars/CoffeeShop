// errorHandler.js

// Mapea errores personalizados a respuestas HTTP estándar y maneja errores no controlados en la API.
const MapErrorToHttp = require('../MapErrorToHttp');
const {
    MaintenanceModeError
} = require('../../Errors/ApplicationErrors');

function sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
        return body;
    }

    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];

    const sanitized = { ...body };

    for (const field of sensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = '[REDACTED]';
        }
    }

    return sanitized;
}

function errorHandler(logger) {
    return function (error, req, res, next) {
        const logPayload = {
            message: error.message,
            stack: error.stack,
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            query: req.query
        };

        if (process.env.NODE_ENV === 'development') {
            logPayload.body = sanitizeBody(req.body);
        }

        const mappedError = MapErrorToHttp(error);

        if (error instanceof MaintenanceModeError) {
            if (logger && typeof logger.warn === 'function') {
                logger.warn('Solicitud bloqueada por mantenimiento del sistema.', {
                    method: logPayload.method,
                    url: logPayload.url
                });
            }

            return res.status(mappedError.statusCode).json(mappedError.body);
        }

        if (logger && typeof logger.error === 'function') {
            logger.error('Error no controlado en la API', logPayload);
        }

        return res.status(mappedError.statusCode).json(mappedError.body);
    };
}

module.exports = errorHandler;
