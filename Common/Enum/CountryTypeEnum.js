// CountryTypeEnum.js

// Define los países disponibles para validación telefónica, llamadas,
// consultas internacionales y envío de SMS.

const CountryTypeEnum = Object.freeze({
    Undefined: 0,

    // -------------------------------------------------------------------------
    // Centroamérica
    // -------------------------------------------------------------------------
    ElSalvador: 1,
    Guatemala: 2,
    Honduras: 3,
    Nicaragua: 4,
    CostaRica: 5,
    Panama: 6,
    Belize: 7,

    // -------------------------------------------------------------------------
    // Norteamérica
    // -------------------------------------------------------------------------
    EstadosUnidos: 8,
    Canada: 9,
    Mexico: 10,

    // -------------------------------------------------------------------------
    // Caribe / Latinoamérica
    // -------------------------------------------------------------------------
    RepublicaDominicana: 11,
    Cuba: 12,
    PuertoRico: 13,

    // -------------------------------------------------------------------------
    // Sudamérica
    // -------------------------------------------------------------------------
    Colombia: 14,
    Venezuela: 15,
    Ecuador: 16,
    Peru: 17,
    Bolivia: 18,
    Chile: 19,
    Argentina: 20,
    Uruguay: 21,
    Paraguay: 22,
    Brasil: 23,

    // -------------------------------------------------------------------------
    // Europa / Otros países soportados
    // -------------------------------------------------------------------------
    Espana: 24,
    Rusia: 25,
    Suecia: 26,
    ReinoUnido: 27
});

module.exports = CountryTypeEnum;
