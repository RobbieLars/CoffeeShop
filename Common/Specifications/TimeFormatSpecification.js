// TimeFormatSpecification.js

const TimeFormat = require('../Enum/TimeFormat');

// Especificación para verificar si un formato de hora es válido.
class TimeFormatSpecification {
    static isSatisfiedBy(timeFormat) {
        const value = Number(timeFormat);

        if (!Number.isInteger(value)) {
            return false;
        }

        return Object.values(TimeFormat).includes(value)
            && value !== TimeFormat.Undefined;
    }

    static ensureIsValid(timeFormat) {
        if (!this.isSatisfiedBy(timeFormat)) {
            throw new Error(`Invalid time format: ${timeFormat}`);
        }
    }
}

module.exports = TimeFormatSpecification;
