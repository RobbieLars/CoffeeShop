// MapErrorToHttp.js
const {
    ValidationError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    MaintenanceModeError
} = require('../Errors/ApplicationErrors');

// Función para mapear errores personalizados a respuestas HTTP
function MapErrorToHttp(error) {
    // 400 Bad Request para errores de validación
    if (error instanceof ValidationError) {
        return {
            statusCode: 400,
            body: {
                message: error.message,
                errors: error.errors
            }
        };
    }

    // 404 Not Found para errores de recurso no encontrado
    if (error instanceof NotFoundError) {
        return {
            statusCode: 404,
            body: {
                message: error.message
            }
        };
    }

    // 409 Conflict para errores de conflicto, como asociaciones existentes
    if (error instanceof ConflictError) {
        const body = {
            message: error.message
        };

        if (error.details) {
            body.details = error.details;
        }

        return {
            statusCode: 409,
            body
        };
    }

    // 401 Unauthorized para credenciales de autenticación inválidas
    if (error instanceof UnauthorizedError) {
        return {
            statusCode: 401,
            body: {
                message: error.message
            }
        };
    }

    // 403 Forbidden para usuarios autenticados sin acceso
    if (error instanceof ForbiddenError) {
        return {
            statusCode: 403,
            body: {
                message: error.message
            }
        };
    }

    // 503 Service Unavailable para mantenimiento del sistema
    if (error instanceof MaintenanceModeError) {
        return {
            statusCode: 503,
            body: {
                message: error.message,
                maintenance: error.maintenanceResponse ?? null
            }
        };
    }

    // 500 Internal Server Error para cualquier otro error no manejado
    return {
        statusCode: 500,
        body: {
            message: 'Error interno del servidor.'
        }
    };
}

module.exports = MapErrorToHttp;
