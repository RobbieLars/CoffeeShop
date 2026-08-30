// Error.js
// Definición de errores personalizados para la aplicación

// AppError es la clase base para todos los errores personalizados en la aplicación
class AppError extends Error {
    constructor(message, code, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
    }
}

// ValidationError se utiliza para errores de validación, incluyendo detalles de los errores específicos
class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 'VALIDATION_ERROR', errors);
        this.errors = errors;
    }
}

// NotFoundError se utiliza para indicar que un recurso no fue encontrado
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 'NOT_FOUND');
    }
}

// ConflictError se utiliza para indicar que hay un conflicto, como un recurso que ya existe
class ConflictError extends AppError {
    constructor(message, details = null) {
        super(message, 'CONFLICT', details);
    }
}
// UnauthorizedError se utiliza cuando las credenciales no son válidas.
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 'UNAUTHORIZED');
    }
}

// ForbiddenError se utiliza cuando el usuario no tiene permiso de acceso.
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 'FORBIDDEN');
    }
}

// MaintenanceModeError se utiliza cuando el servidor está en mantenimiento.
class MaintenanceModeError extends AppError {
    constructor(maintenanceResponse) {
        super('Servidor en mantenimiento.', 'MAINTENANCE_MODE');

        this.maintenanceResponse = maintenanceResponse;
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    MaintenanceModeError
};