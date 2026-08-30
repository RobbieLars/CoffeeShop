// BirthdaySpecification.js

const DateSpecification = require('./DateSpecification');

// Especificación reutilizable para fechas de nacimiento. Las políticas de cada
// sistema, como una fecha mínima, se reciben mediante opciones.
class BirthdaySpecification {
    static isSatisfiedBy(birthday, options = {}) {
        if (!DateSpecification.isSatisfiedBy(birthday)) {
            return false;
        }

        const minDate = options.minDate ?? null;

        if (minDate && !DateSpecification.isSatisfiedBy(minDate)) {
            return false;
        }

        const referenceDate = options.referenceDate ?? new Date();
        const maximumDate = this._toLocalDateString(referenceDate);

        if (!maximumDate) {
            return false;
        }

        return (!minDate || birthday >= minDate) && birthday <= maximumDate;
    }

    static ensureIsValid(birthday, options = {}) {
        if (!this.isSatisfiedBy(birthday, options)) {
            throw new Error(`Invalid birthday: ${birthday}`);
        }
    }

    static _toLocalDateString(value) {
        const date = value instanceof Date ? value : new Date(value);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return [
            String(date.getFullYear()).padStart(4, '0'),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');
    }
}

module.exports = BirthdaySpecification;
