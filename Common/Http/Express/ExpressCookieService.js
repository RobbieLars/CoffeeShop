// ExpressCookieService.js

const ICookieService = require('../Interface/ICookieService');
const { ValidationError } = require('../../Errors/ApplicationErrors');

class ExpressCookieService extends ICookieService {
    constructor(config = {}) {
        super();
        this._config = {
            secure: config.secure ?? (process.env.NODE_ENV === 'production'),
            sameSite: config.sameSite ?? 'lax',
            ...config,
        };
    }

    // -----------------------------------------------------------------------------
    // setCookie:
    // Crea una cookie genérica con las opciones proporcionadas.
    // -----------------------------------------------------------------------------
    setCookie(res, name, value, options = {}) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!name) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        if (value === undefined || value === null) {
            throw new ValidationError('El valor de la cookie es obligatorio.');
        }

        res.cookie(name, value, {
            ...this._getBaseCookieOptions(),
            ...this._removeUndefinedValues(options),
        });
    }

    // -----------------------------------------------------------------------------
    // getCookie:
    // Obtiene una cookie genérica desde la petición.
    // -----------------------------------------------------------------------------
    getCookie(req, name) {
        if (!req) {
            throw new ValidationError('La petición HTTP es obligatoria.');
        }

        if (!name) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        this._ensureCookiesWereParsed(req);

        return req.cookies[name] ?? null;
    }

    // -----------------------------------------------------------------------------
    // clearCookie:
    // Limpia una cookie genérica.
    // -----------------------------------------------------------------------------
    clearCookie(res, name, options = {}) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!name) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        res.clearCookie(name, {
            ...this._getBaseCookieOptions(),
            ...this._removeUndefinedValues(options),
        });
    }

    // -----------------------------------------------------------------------------
    // _ensureCookiesWereParsed:
    // Verifica que la petición tenga cookies parseadas.
    // -----------------------------------------------------------------------------
    _ensureCookiesWereParsed(req) {
        if (typeof req.cookies === 'undefined') {
            throw new Error(
                'Las cookies no fueron parseadas. Asegúrate de registrar cookie-parser en Express.'
            );
        }
    }

    // -----------------------------------------------------------------------------
    // _getBaseCookieOptions:
    // Construye las opciones base compartidas por todas las cookies.
    // -----------------------------------------------------------------------------
    _getBaseCookieOptions() {
        return {
            httpOnly: true,
            secure: this._config.secure,
            sameSite: this._config.sameSite,
        };
    }

    // -----------------------------------------------------------------------------
    // _removeUndefinedValues:
    // Elimina propiedades undefined para evitar sobrescribir defaults.
    // -----------------------------------------------------------------------------
    _removeUndefinedValues(obj = {}) {
        return Object.fromEntries(
            Object.entries(obj).filter(([, value]) => value !== undefined)
        );
    }
}

module.exports = ExpressCookieService;
