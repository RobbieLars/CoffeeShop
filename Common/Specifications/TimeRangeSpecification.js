// Verifica rangos horarios del mismo día en formato HH:mm.
class TimeRangeSpecification {
    static isSatisfiedBy(openingTime, closingTime) {
        const openingMinutes = this._timeToMinutes(openingTime);
        const closingMinutes = this._timeToMinutes(closingTime);

        if (openingMinutes === null || closingMinutes === null) {
            return false;
        }

        return openingMinutes < closingMinutes;
    }

    static _timeToMinutes(time) {
        if (typeof time !== 'string') {
            return null;
        }

        const match = time.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);

        if (!match) {
            return null;
        }

        return (Number(match[1]) * 60) + Number(match[2]);
    }
}

module.exports = TimeRangeSpecification;
