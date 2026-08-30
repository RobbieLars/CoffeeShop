// CountryPhoneNumberSpecification.js

const CountryTypeEnum = require('../Enum/CountryTypeEnum');
const CountryPhoneRules = require('../Constants/CountryPhoneRules');

function normalizePhoneNumber(number) {
    if (number === undefined || number === null) {
        return '';
    }

    return String(number).replace(/\D/g, '');
}

// Especificacion para verificar si un numero cumple la longitud del pais seleccionado.
class CountryPhoneNumberSpecification {
    static isSatisfiedBy(phoneData) {
        const country = Number(phoneData?.country);

        if (!Number.isInteger(country)) {
            return false;
        }

        if (country === CountryTypeEnum.Undefined) {
            return true;
        }

        const countryPhoneRule = CountryPhoneRules[country] ?? null;

        if (!countryPhoneRule) {
            return false;
        }

        const phoneNumber = normalizePhoneNumber(phoneData?.number);

        return phoneNumber.length >= countryPhoneRule.minLength
            && phoneNumber.length <= countryPhoneRule.maxLength;
    }

    static ensureIsValid(phoneData) {
        if (!this.isSatisfiedBy(phoneData)) {
            throw new Error(
                `Invalid phone number for country: ${phoneData?.country}`
            );
        }
    }
}

module.exports = CountryPhoneNumberSpecification;
