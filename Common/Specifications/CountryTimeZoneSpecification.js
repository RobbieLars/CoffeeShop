// CountryTimeZoneSpecification.js

const CountryTimeZoneEnum = require('../Enum/CountryTimeZoneEnum');

// Especificación para verificar si un país/zona horaria es válido.
class CountryTimeZoneSpecification {
    static isSatisfiedBy(countryTimeZone) {
        const value = Number(countryTimeZone);

        if (!Number.isInteger(value)) {
            return false;
        }

        return Object.values(CountryTimeZoneEnum).includes(value)
            && value !== CountryTimeZoneEnum.Undefined;
    }

    static ensureIsValid(countryTimeZone) {
        if (!this.isSatisfiedBy(countryTimeZone)) {
            throw new Error(`Invalid country time zone: ${countryTimeZone}`);
        }
    }
}

module.exports = CountryTimeZoneSpecification;
