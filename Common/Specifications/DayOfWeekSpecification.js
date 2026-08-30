const DayOfWeek = require('../Enum/DayOfWeek');

class DayOfWeekSpecification {
    static isSatisfiedBy(dayOfWeek) {
        return Object.values(DayOfWeek).includes(dayOfWeek);
    }

    static ensureIsValid(dayOfWeek) {
        if (!this.isSatisfiedBy(dayOfWeek)) {
            throw new Error(`Invalid day of week: ${dayOfWeek}`);
        }
    }
}

module.exports = DayOfWeekSpecification;
