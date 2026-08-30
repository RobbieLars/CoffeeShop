// phoneNumberHelper.js

const CountryPhoneRules = require('../Constants/CountryPhoneRules');

function normalizePhoneNumber(number) {
    if (number === undefined || number === null) {
        return '';
    }

    return String(number).replace(/\D/g, '');
}

function getCountryPhoneRule(country) {
    const countryValue = Number(country);

    if (!Number.isInteger(countryValue)) {
        return null;
    }

    return CountryPhoneRules[countryValue] ?? null;
}

function formatLocalPhoneNumber(number) {
    const normalizedNumber = normalizePhoneNumber(number);

    if (!normalizedNumber) {
        return '';
    }

    return normalizedNumber
        .replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
}

function buildCompletePhoneNumber(country, number) {
    const formattedNumber = formatLocalPhoneNumber(number);

    if (!formattedNumber) {
        return '';
    }

    const countryPhoneRule = getCountryPhoneRule(country);

    if (!countryPhoneRule?.countryCode) {
        return formattedNumber;
    }

    return `+${countryPhoneRule.countryCode} ${formattedNumber}`;
}

function getCountryPhoneName(country) {
    const countryPhoneRule = getCountryPhoneRule(country);

    return countryPhoneRule?.name ?? null;
}

module.exports = {
    normalizePhoneNumber,
    getCountryPhoneRule,
    formatLocalPhoneNumber,
    buildCompletePhoneNumber,
    getCountryPhoneName
};
