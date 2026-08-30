// Validador declarativo para reglas universales de DTOs.
// Los validadores de servicio deciden qué campos son requeridos en cada acción.
class CommonDtoValidator {
    static validate(dto, fields, options = {}) {
        const errors = [];

        if (!this._isObject(dto)) {
            return ['El cuerpo de la solicitud es obligatorio.'];
        }

        const requiredFields = new Set(options.requiredFields ?? []);
        const forbiddenFields = new Set(options.forbiddenFields ?? []);
        const providedFields = Object.keys(fields).filter(field =>
            this.isProvided(dto, field) && !forbiddenFields.has(field)
        );

        for (const field of forbiddenFields) {
            if (this.isProvided(dto, field)) {
                errors.push(`El campo ${field} no está permitido en esta operación.`);
            }
        }

        if (options.requireAtLeastOne && providedFields.length === 0) {
            errors.push(
                options.emptyUpdateMessage ??
                'Debe enviar al menos un campo para actualizar.'
            );
        }

        for (const [field, rules] of Object.entries(fields)) {
            if (forbiddenFields.has(field)) continue;

            const provided = this.isProvided(dto, field);

            if (!provided) {
                if (requiredFields.has(field) || rules.required) {
                    errors.push(
                        rules.requiredMessage ??
                        `El campo ${field} es obligatorio.`
                    );
                }

                continue;
            }

            const value = dto[field];

            if (value === null) {
                if (!rules.nullable) {
                    errors.push(
                        rules.nullMessage ??
                        `El campo ${field} no puede ser null.`
                    );
                }

                continue;
            }

            this._validateValue(errors, field, value, rules);
        }

        return errors;
    }

    static isProvided(dto, field) {
        return Object.hasOwn(dto, field) && dto[field] !== undefined;
    }

    static _isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    static _validateValue(errors, field, value, rules) {
        switch (rules.type) {
        case 'string':
            this._validateString(errors, field, value, rules);
            break;
        case 'number':
            this._validateNumber(errors, field, value, rules);
            break;
        case 'boolean':
            if (typeof value !== 'boolean') {
                errors.push(
                    rules.typeMessage ??
                    `El campo ${field} debe ser un valor booleano.`
                );
            }
            break;
        case 'objectId':
            this._validateObjectId(errors, field, value, rules);
            break;
        case 'date':
            this._validateDate(errors, field, value, rules);
            break;
        default:
            break;
        }
    }

    static _validateString(errors, field, value, rules) {
        if (typeof value !== 'string') {
            errors.push(
                rules.typeMessage ??
                `El campo ${field} debe ser de tipo string.`
            );
            return;
        }

        const normalizedValue = rules.trim === false ? value : value.trim();

        if (!rules.allowEmpty && normalizedValue.length === 0) {
            errors.push(
                rules.emptyMessage ??
                `El campo ${field} no puede estar vacío.`
            );
            return;
        }

        if (
            rules.minLength !== undefined &&
            normalizedValue.length < rules.minLength
        ) {
            errors.push(
                rules.minLengthMessage ??
                `El campo ${field} debe tener al menos ${rules.minLength} caracteres.`
            );
        }

        if (
            rules.maxLength !== undefined &&
            normalizedValue.length > rules.maxLength
        ) {
            errors.push(
                rules.maxLengthMessage ??
                `El campo ${field} no puede exceder los ${rules.maxLength} caracteres.`
            );
        }

        if (rules.noWhitespace && /\s/.test(normalizedValue)) {
            errors.push(
                rules.whitespaceMessage ??
                `El campo ${field} no puede contener espacios.`
            );
        }

        if (rules.pattern && !rules.pattern.test(normalizedValue)) {
            errors.push(
                rules.patternMessage ??
                `El campo ${field} tiene un formato inválido.`
            );
        }
    }

    static _validateNumber(errors, field, value, rules) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            errors.push(
                rules.typeMessage ??
                `El campo ${field} debe ser un número.`
            );
            return;
        }

        if (rules.integer && !Number.isInteger(value)) {
            errors.push(
                rules.integerMessage ??
                `El campo ${field} debe ser un número entero.`
            );
            return;
        }

        if (rules.min !== undefined && value < rules.min) {
            errors.push(
                rules.minMessage ??
                `El campo ${field} debe ser mayor o igual a ${rules.min}.`
            );
        }

        if (rules.exclusiveMin !== undefined && value <= rules.exclusiveMin) {
            errors.push(
                rules.minMessage ??
                `El campo ${field} debe ser mayor que ${rules.exclusiveMin}.`
            );
        }

        if (rules.max !== undefined && value > rules.max) {
            errors.push(
                rules.maxMessage ??
                `El campo ${field} debe ser menor o igual a ${rules.max}.`
            );
        }
    }

    static _validateObjectId(errors, field, value, rules) {
        if (rules.allowEmpty && value === '') {
            return;
        }

        if (typeof value !== 'string') {
            errors.push(
                rules.typeMessage ??
                `El campo ${field} debe ser de tipo string.`
            );
            return;
        }

        if (!/^[a-fA-F0-9]{24}$/.test(value)) {
            errors.push(
                rules.objectIdMessage ??
                `El campo ${field} debe ser un ObjectId válido.`
            );
        }
    }

    static _validateDate(errors, field, value, rules) {
        const date = value instanceof Date ? value : new Date(value);

        if (Number.isNaN(date.getTime())) {
            errors.push(
                rules.dateMessage ??
                `El campo ${field} debe ser una fecha válida.`
            );
        }
    }
}

module.exports = CommonDtoValidator;
