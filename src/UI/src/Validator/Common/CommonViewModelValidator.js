class CommonViewModelValidator {

    // -------------------------------------------------------------------------
    // Validate
    // -------------------------------------------------------------------------
    static validate(viewModel = {}, fields = {}, options = {}) {
        const errors = {};

        for (const [fieldName, rules] of Object.entries(fields)) {
            const fieldErrors = this.validateField(
                fieldName,
                viewModel[fieldName],
                rules
            );

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors[0];
            }
        }

        if (
            options.requireAtLeastOne === true &&
            !this._hasAtLeastOneValue(viewModel, fields)
        ) {
            errors.form =
                options.requireAtLeastOneMessage ??
                'Debe proporcionar al menos un campo.';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // -------------------------------------------------------------------------
    // Validate Field
    // -------------------------------------------------------------------------
    static validateField(fieldName, value, rules = {}) {
        const errors = [];
        const label = rules.label ?? fieldName;
        const isEmpty = this._isEmpty(value);

        // ---------------------------------------------------------------------
        // Required
        // ---------------------------------------------------------------------
        if (isEmpty) {
            if (rules.required === true) {
                errors.push(
                    rules.requiredMessage ??
                    `El campo ${label} es requerido.`
                );
            }

            return errors;
        }

        // ---------------------------------------------------------------------
        // Normalize
        // ---------------------------------------------------------------------
        const normalizedValue = this._normalizeValue(
            value,
            rules.type
        );

        // ---------------------------------------------------------------------
        // Type
        // ---------------------------------------------------------------------
        if (!this._hasValidType(normalizedValue, rules.type)) {
            errors.push(
                rules.typeMessage ??
                `El campo ${label} no tiene un tipo de dato válido.`
            );

            return errors;
        }

        // ---------------------------------------------------------------------
        // String - Min Length
        // ---------------------------------------------------------------------
        if (
            rules.type === 'string' &&
            rules.minLength !== null &&
            rules.minLength !== undefined &&
            normalizedValue.length < rules.minLength
        ) {
            errors.push(
                `El campo ${label} debe tener al menos ` +
                `${rules.minLength} caracteres.`
            );
        }

        // ---------------------------------------------------------------------
        // String - Max Length
        // ---------------------------------------------------------------------
        if (
            rules.type === 'string' &&
            rules.maxLength !== null &&
            rules.maxLength !== undefined &&
            normalizedValue.length > rules.maxLength
        ) {
            errors.push(
                `El campo ${label} debe tener como máximo ` +
                `${rules.maxLength} caracteres.`
            );
        }

        // ---------------------------------------------------------------------
        // Number - Integer
        // ---------------------------------------------------------------------
        if (
            rules.type === 'number' &&
            rules.integer === true &&
            !Number.isInteger(normalizedValue)
        ) {
            errors.push(
                `El campo ${label} debe ser un número entero.`
            );
        }

        // ---------------------------------------------------------------------
        // Number - Min
        // ---------------------------------------------------------------------
        if (
            rules.type === 'number' &&
            rules.min !== null &&
            rules.min !== undefined &&
            normalizedValue < rules.min
        ) {
            errors.push(
                `El campo ${label} no puede ser menor que ${rules.min}.`
            );
        }

        // ---------------------------------------------------------------------
        // Number - Max
        // ---------------------------------------------------------------------
        if (
            rules.type === 'number' &&
            rules.max !== null &&
            rules.max !== undefined &&
            normalizedValue > rules.max
        ) {
            errors.push(
                `El campo ${label} no puede ser mayor que ${rules.max}.`
            );
        }

        // ---------------------------------------------------------------------
        // Allowed Values
        // ---------------------------------------------------------------------
        if (
            Array.isArray(rules.allowedValues) &&
            !rules.allowedValues.includes(normalizedValue)
        ) {
            errors.push(
                `El campo ${label} contiene un valor no permitido.`
            );
        }

        return errors;
    }

    // -------------------------------------------------------------------------
    // Normalize Value
    // -------------------------------------------------------------------------
    static _normalizeValue(value, type) {

        // ---------------------------------------------------------------------
        // Number
        // ---------------------------------------------------------------------
        if (type === 'number') {
            if (typeof value === 'number') {
                return value;
            }

            // Los inputs HTML normalmente entregan números como string.
            if (
                typeof value === 'string' &&
                value.trim() !== ''
            ) {
                return Number(value);
            }

            // Evita conversiones de JavaScript como:
            // Number(false) -> 0
            // Number([])    -> 0
            return NaN;
        }

        // ---------------------------------------------------------------------
        // String
        // ---------------------------------------------------------------------
        if (type === 'string') {
            return typeof value === 'string'
                ? value.trim()
                : value;
        }

        // ---------------------------------------------------------------------
        // Date
        // ---------------------------------------------------------------------
        if (type === 'date') {
            if (value instanceof Date) {
                return value;
            }

            // Los inputs type="date" entregan normalmente un string.
            if (
                typeof value === 'string' &&
                value.trim() !== ''
            ) {
                return new Date(value);
            }

            // Evita conversiones no deseadas como:
            // new Date(false)
            // new Date(null)
            return new Date(NaN);
        }

        // Boolean y tipos sin normalización se mantienen.
        return value;
    }

    // -------------------------------------------------------------------------
    // Has Valid Type
    // -------------------------------------------------------------------------
    static _hasValidType(value, type) {
        // Si no se especificó tipo, no se aplica validación de tipo.
        if (!type) {
            return true;
        }

        if (type === 'string') {
            return typeof value === 'string';
        }

        if (type === 'number') {
            return (
                typeof value === 'number' &&
                Number.isFinite(value)
            );
        }

        if (type === 'boolean') {
            return typeof value === 'boolean';
        }

        if (type === 'date') {
            return (
                value instanceof Date &&
                !Number.isNaN(value.getTime())
            );
        }

        // Si alguien define accidentalmente un tipo no soportado,
        // la regla no debe pasar silenciosamente.
        return false;
    }

    // -------------------------------------------------------------------------
    // Is Empty
    // -------------------------------------------------------------------------
    static _isEmpty(value) {
        return (
            value === undefined ||
            value === null ||
            (
                typeof value === 'string' &&
                value.trim() === ''
            )
        );
    }

    // -------------------------------------------------------------------------
    // Has At Least One Value
    // -------------------------------------------------------------------------
    static _hasAtLeastOneValue(viewModel, fields) {
        return Object.keys(fields).some(
            fieldName => !this._isEmpty(viewModel[fieldName])
        );
    }
}

export default CommonViewModelValidator;