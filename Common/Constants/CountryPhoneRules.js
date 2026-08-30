// CountryPhoneRules.js
// Catálogo de reglas telefónicas por país soportado.

const CountryTypeEnum = require('../Enum/CountryTypeEnum');

const CountryPhoneRules = Object.freeze({
    [CountryTypeEnum.Undefined]: {
        name: 'No definido',
        isoCode: null,
        countryCode: null,
        minLength: 6,
        maxLength: 15
    },

    [CountryTypeEnum.ElSalvador]: {
        name: 'El Salvador',
        isoCode: 'SV',
        countryCode: '503',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.Guatemala]: {
        name: 'Guatemala',
        isoCode: 'GT',
        countryCode: '502',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.Honduras]: {
        name: 'Honduras',
        isoCode: 'HN',
        countryCode: '504',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.Nicaragua]: {
        name: 'Nicaragua',
        isoCode: 'NI',
        countryCode: '505',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.CostaRica]: {
        name: 'Costa Rica',
        isoCode: 'CR',
        countryCode: '506',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.Panama]: {
        name: 'Panamá',
        isoCode: 'PA',
        countryCode: '507',
        minLength: 8,
        maxLength: 8
    },

    [CountryTypeEnum.Belize]: {
        name: 'Belice',
        isoCode: 'BZ',
        countryCode: '501',
        minLength: 7,
        maxLength: 7
    },

    [CountryTypeEnum.EstadosUnidos]: {
        name: 'Estados Unidos',
        isoCode: 'US',
        countryCode: '1',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Canada]: {
        name: 'Canadá',
        isoCode: 'CA',
        countryCode: '1',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Mexico]: {
        name: 'México',
        isoCode: 'MX',
        countryCode: '52',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Colombia]: {
        name: 'Colombia',
        isoCode: 'CO',
        countryCode: '57',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Argentina]: {
        name: 'Argentina',
        isoCode: 'AR',
        countryCode: '54',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Chile]: {
        name: 'Chile',
        isoCode: 'CL',
        countryCode: '56',
        minLength: 9,
        maxLength: 9
    },

    [CountryTypeEnum.Peru]: {
        name: 'Perú',
        isoCode: 'PE',
        countryCode: '51',
        minLength: 9,
        maxLength: 9
    },

    [CountryTypeEnum.Brasil]: {
        name: 'Brasil',
        isoCode: 'BR',
        countryCode: '55',
        minLength: 10,
        maxLength: 11
    },

    [CountryTypeEnum.Espana]: {
        name: 'España',
        isoCode: 'ES',
        countryCode: '34',
        minLength: 9,
        maxLength: 9
    },

    [CountryTypeEnum.Rusia]: {
        name: 'Rusia',
        isoCode: 'RU',
        countryCode: '7',
        minLength: 10,
        maxLength: 10
    },

    [CountryTypeEnum.Suecia]: {
        name: 'Suecia',
        isoCode: 'SE',
        countryCode: '46',
        minLength: 7,
        maxLength: 10
    },

    [CountryTypeEnum.ReinoUnido]: {
        name: 'Reino Unido',
        isoCode: 'GB',
        countryCode: '44',
        minLength: 10,
        maxLength: 10
    }
});

module.exports = CountryPhoneRules;
