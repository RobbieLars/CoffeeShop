// CountryTimeZones.js

const CountryTimeZoneEnum = require('../Enum/CountryTimeZoneEnum');

// -----------------------------------------------------------------------------
// CountryTimeZones:
// Mapa centralizado de países con su zona horaria IANA.
// -----------------------------------------------------------------------------
const CountryTimeZones = Object.freeze({
    [CountryTimeZoneEnum.ElSalvador]: {
        country: 'El Salvador',
        city: 'San Salvador',
        timeZone: 'America/El_Salvador',
        label: 'Hora actual de El Salvador'
    },

    [CountryTimeZoneEnum.EstadosUnidos]: {
        country: 'Estados Unidos',
        city: 'Nueva York',
        timeZone: 'America/New_York',
        label: 'Hora actual de Estados Unidos'
    },

    [CountryTimeZoneEnum.Suecia]: {
        country: 'Suecia',
        city: 'Estocolmo',
        timeZone: 'Europe/Stockholm',
        label: 'Hora actual de Suecia'
    },

    [CountryTimeZoneEnum.Espana]: {
        country: 'España',
        city: 'Madrid',
        timeZone: 'Europe/Madrid',
        label: 'Hora actual de España'
    },

    [CountryTimeZoneEnum.Mexico]: {
        country: 'México',
        city: 'Ciudad de México',
        timeZone: 'America/Mexico_City',
        label: 'Hora actual de México'
    },

    [CountryTimeZoneEnum.Guatemala]: {
        country: 'Guatemala',
        city: 'Ciudad de Guatemala',
        timeZone: 'America/Guatemala',
        label: 'Hora actual de Guatemala'
    },

    [CountryTimeZoneEnum.CostaRica]: {
        country: 'Costa Rica',
        city: 'San José',
        timeZone: 'America/Costa_Rica',
        label: 'Hora actual de Costa Rica'
    },

    [CountryTimeZoneEnum.Colombia]: {
        country: 'Colombia',
        city: 'Bogotá',
        timeZone: 'America/Bogota',
        label: 'Hora actual de Colombia'
    },

    [CountryTimeZoneEnum.Argentina]: {
        country: 'Argentina',
        city: 'Buenos Aires',
        timeZone: 'America/Argentina/Buenos_Aires',
        label: 'Hora actual de Argentina'
    },

    [CountryTimeZoneEnum.Chile]: {
        country: 'Chile',
        city: 'Santiago',
        timeZone: 'America/Santiago',
        label: 'Hora actual de Chile'
    },

    [CountryTimeZoneEnum.Peru]: {
        country: 'Perú',
        city: 'Lima',
        timeZone: 'America/Lima',
        label: 'Hora actual de Perú'
    },

    [CountryTimeZoneEnum.Brasil]: {
        country: 'Brasil',
        city: 'São Paulo',
        timeZone: 'America/Sao_Paulo',
        label: 'Hora actual de Brasil'
    },

    [CountryTimeZoneEnum.Canada]: {
        country: 'Canadá',
        city: 'Toronto',
        timeZone: 'America/Toronto',
        label: 'Hora actual de Canadá'
    },

    [CountryTimeZoneEnum.ReinoUnido]: {
        country: 'Reino Unido',
        city: 'Londres',
        timeZone: 'Europe/London',
        label: 'Hora actual de Reino Unido'
    }
});

module.exports = CountryTimeZones;
