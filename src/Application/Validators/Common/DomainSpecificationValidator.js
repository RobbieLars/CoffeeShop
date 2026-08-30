// DomainSpecificationValidator.js
const { ValidationError } = require('@coffeeshop/common/Errors/ApplicationErrors');

// Esta clase se encarga de validar un conjunto de reglas basadas en especificaciones de dominio.
class DomainSpecificationValidator {
    static getErrors(rules = []) {
        const errors = [];

        for (const rule of rules) {
            const {
                value,
                specification,
                fieldName,
                message
            } = rule;

            if (value === undefined || value === null) {
                continue;
            }

            if (
                !specification ||
                typeof specification.isSatisfiedBy !== 'function'
            ) {
                throw new Error(
                    `La specification del campo '${fieldName}' no implementa isSatisfiedBy.`
                );
            }

            if (!specification.isSatisfiedBy(value)) {
                errors.push(
                    message ?? `El campo ${fieldName} no tiene un valor válido.`
                );
            }
        }

        return errors;
    }

    static ensureValid(rules = []) {
        const errors = this.getErrors(rules);

        if (errors.length > 0) {
            throw new ValidationError('Error de validación.', errors);
        }
    }
}

module.exports = DomainSpecificationValidator;
