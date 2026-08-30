// Verifica rangos de fecha/hora y permite extremos abiertos.
class DateTimeRangeSpecification {
    static isSatisfiedBy(startAt, endAt) {
        const startDate = this._toDate(startAt);
        const endDate = this._toDate(endAt);

        if (this._hasValue(startAt) && !startDate) {
            return false;
        }

        if (this._hasValue(endAt) && !endDate) {
            return false;
        }

        if (!startDate || !endDate) {
            return true;
        }

        return endDate >= startDate;
    }

    static _toDate(value) {
        if (!this._hasValue(value)) {
            return null;
        }

        const date = value instanceof Date ? value : new Date(value);

        return Number.isNaN(date.getTime()) ? null : date;
    }

    static _hasValue(value) {
        return value !== undefined && value !== null && value !== '';
    }
}

module.exports = DateTimeRangeSpecification;
