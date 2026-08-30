// Valida los límites comunes de paginación de las APIs.
class PaginationValidator {
    validate(dto) {
        const errors = [];

        if (!Number.isInteger(dto.page) || dto.page <= 0) {
            errors.push('El parámetro page debe ser un número entero mayor que 0.');
        }

        if (!Number.isInteger(dto.pageSize) || dto.pageSize <= 0) {
            errors.push('El parámetro pageSize debe ser un número entero mayor que 0.');
        }

        if (dto.page > 1000) {
            errors.push('El parámetro page no puede ser mayor que 1000.');
        }

        if (dto.pageSize > 100) {
            errors.push('El parámetro pageSize no puede ser mayor que 100.');
        }

        return errors;
    }
}

module.exports = PaginationValidator;
