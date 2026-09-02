class ViewModelFieldHelper {

    // -------------------------------------------------------------------------
    // buildInputProps
    // -------------------------------------------------------------------------
    // Traduce las reglas del ViewModelValidator a propiedades HTML.
    //
    // No administra:
    // - value
    // - checked
    // - name
    // - id
    // - className
    // - onChange
    // - onInput
    //
    // La View sigue siendo responsable del estado React.
    static buildInputProps(rules = {}) {
        const props = {};

        // ---------------------------------------------------------------------
        // Type
        // ---------------------------------------------------------------------
        switch (rules.type) {
            case 'string':
                props.type = 'text';
                break;

            case 'number':
                props.type = 'number';
                props.inputMode = rules.integer === true
                    ? 'numeric'
                    : 'decimal';
                break;

            case 'date':
                props.type = 'date';
                break;

            case 'boolean':
                props.type = 'checkbox';
                break;

            default:
                props.type = 'text';
                break;
        }

        // ---------------------------------------------------------------------
        // Required
        // ---------------------------------------------------------------------
        if (rules.required === true) {
            props.required = true;
        }

        // ---------------------------------------------------------------------
        // String
        // ---------------------------------------------------------------------
        if (rules.type === 'string') {
            if (
                rules.minLength !== undefined &&
                rules.minLength !== null
            ) {
                props.minLength = rules.minLength;
            }

            if (
                rules.maxLength !== undefined &&
                rules.maxLength !== null
            ) {
                props.maxLength = rules.maxLength;
            }
        }

        // ---------------------------------------------------------------------
        // Number
        // ---------------------------------------------------------------------
        if (rules.type === 'number') {
            if (
                rules.min !== undefined &&
                rules.min !== null
            ) {
                props.min = rules.min;
            }

            if (
                rules.max !== undefined &&
                rules.max !== null
            ) {
                props.max = rules.max;
            }

            props.step = rules.integer === true
                ? 1
                : 'any';
        }

        // ---------------------------------------------------------------------
        // Date
        // ---------------------------------------------------------------------
        if (rules.type === 'date') {
            if (
                rules.min !== undefined &&
                rules.min !== null
            ) {
                props.min = rules.min;
            }

            if (
                rules.max !== undefined &&
                rules.max !== null
            ) {
                props.max = rules.max;
            }
        }

        return props;
    }

    // -------------------------------------------------------------------------
    // sanitizeValue
    // -------------------------------------------------------------------------
    // Limpia el valor recibido por onChange sin modificar directamente el DOM.
    static sanitizeValue(value, rules = {}) {
        if (
            value === undefined ||
            value === null
        ) {
            return '';
        }

        switch (rules.type) {
            case 'string':
                return this._sanitizeString(value);

            case 'number':
                return this._sanitizeNumber(
                    value,
                    rules
                );

            default:
                return value;
        }
    }

    // -------------------------------------------------------------------------
    // String
    // -------------------------------------------------------------------------
    static _sanitizeString(value) {
        // No truncamos manualmente maxLength.
        //
        // maxLength ya se entrega al input mediante buildInputProps().
        // CommonViewModelValidator sigue siendo capaz de detectar un exceso
        // si el valor llega por otra vía.
        return String(value);
    }

    // -------------------------------------------------------------------------
    // Number
    // -------------------------------------------------------------------------
    static _sanitizeNumber(value, rules = {}) {
        let text = String(value);

        // Permite pegar coma decimal y la transforma a punto.
        text = text.replace(/,/g, '.');

        const allowDecimal =
            rules.integer !== true;

        const allowNegative =
            rules.min === undefined ||
            rules.min === null ||
            Number(rules.min) < 0;

        let result = '';
        let hasDecimalPoint = false;
        let hasNegativeSign = false;

        for (let index = 0; index < text.length; index++) {
            const character = text[index];

            // Dígitos
            if (/\d/.test(character)) {
                result += character;
                continue;
            }

            // Signo negativo únicamente al inicio.
            if (
                character === '-' &&
                allowNegative &&
                index === 0 &&
                !hasNegativeSign
            ) {
                result += character;
                hasNegativeSign = true;
                continue;
            }

            // Un único punto decimal.
            if (
                character === '.' &&
                allowDecimal &&
                !hasDecimalPoint
            ) {
                result += character;
                hasDecimalPoint = true;
            }

            // Cualquier otro carácter simplemente se ignora.
        }

        return result;
    }
}

export default ViewModelFieldHelper;