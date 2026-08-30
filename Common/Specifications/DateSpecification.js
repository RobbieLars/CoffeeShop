// DateSpecification.js

// Especificación para verificar si una fecha es válida.
// El formato esperado es YYYY-MM-DD.
class DateSpecification {
    static isSatisfiedBy(date) {
        if (typeof date !== 'string') {
            return false;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return false;
        }

        const [year, month, day] = date.split('-').map(Number);

        if (month < 1 || month > 12) {
            return false;
        }

        const daysInMonth = new Date(year, month, 0).getDate();

        return day >= 1 && day <= daysInMonth;
    }

    static ensureIsValid(date) {
        if (!this.isSatisfiedBy(date)) {
            throw new Error(`Invalid date: ${date}`);
        }
    }
}

module.exports = DateSpecification;