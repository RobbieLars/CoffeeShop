// CookieFactory.js

const ICookieFactory = require('../Interface/ICookieFactory');
const { ValidationError } = require('../../Errors/ApplicationErrors');

class CookieFactory extends ICookieFactory {
    constructor(cookieService, dataEncryption = null) {
        super();

        if (!cookieService) {
            throw new ValidationError('El servicio de cookies es obligatorio.');
        }

        this._cookieService = cookieService;
        this._dataEncryption = dataEncryption;
    }

    // -----------------------------------------------------------------------------
    // createObjectCookie:
    // Serializa un objeto y lo almacena en una cookie.
    // Puede cifrar el contenido si así se indica.
    // -----------------------------------------------------------------------------
    createObjectCookie(res, cookieName, payload, options = {}) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!cookieName) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        if (payload === undefined || payload === null) {
            throw new ValidationError('El payload de la cookie es obligatorio.');
        }

        const serializedPayload = JSON.stringify(payload);
        const shouldEncrypt = options.useEncryption ?? options.encrypt ?? false;
        const finalValue = this._encryptIfNeeded(serializedPayload, shouldEncrypt);

        this._cookieService.setCookie(
            res,
            cookieName,
            finalValue,
            this._buildCookieOptions(options)
        );
    }

    // -----------------------------------------------------------------------------
    // getObjectCookie:
    // Obtiene una cookie, la transforma y devuelve su contenido como objeto.
    // Puede descifrar el contenido si así se indica.
    // -----------------------------------------------------------------------------
    getObjectCookie(req, cookieName, options = {}) {
        if (!req) {
            throw new ValidationError('La petición HTTP es obligatoria.');
        }

        if (!cookieName) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        const rawValue = this._cookieService.getCookie(req, cookieName);

        if (!rawValue) {
            return null;
        }

        const shouldDecrypt = options.useEncryption ?? options.encrypt ?? false;
        const plainValue = this._decryptIfNeeded(rawValue, shouldDecrypt);

        try {
            return JSON.parse(plainValue);
        } catch (error) {
            throw new ValidationError(`La cookie '${cookieName}' no contiene un JSON válido.`);
        }
    }

    // -----------------------------------------------------------------------------
    // clearCookie:
    // Limpia una cookie generada por la factoría.
    // -----------------------------------------------------------------------------
    clearCookie(res, cookieName, options = {}) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!cookieName) {
            throw new ValidationError('El nombre de la cookie es obligatorio.');
        }

        this._cookieService.clearCookie(
            res,
            cookieName,
            this._buildClearCookieOptions(options)
        );
    }

    // -----------------------------------------------------------------------------
    // _buildCookieOptions:
    // Construye las opciones reutilizables de la cookie.
    // Solo incluye propiedades definidas para no sobrescribir defaults.
    // -----------------------------------------------------------------------------
    _buildCookieOptions(options = {}) {
        const cookieOptions = {
            path: options.path ?? '/',
            httpOnly: options.httpOnly ?? true,
        };

        if (options.maxAge !== undefined) {
            cookieOptions.maxAge = options.maxAge;
        }

        if (options.expires !== undefined) {
            cookieOptions.expires = options.expires;
        }

        if (options.sameSite !== undefined) {
            cookieOptions.sameSite = options.sameSite;
        }

        if (options.secure !== undefined) {
            cookieOptions.secure = options.secure;
        }

        if (options.domain !== undefined) {
            cookieOptions.domain = options.domain;
        }

        return cookieOptions;
    }

    // -----------------------------------------------------------------------------
    // _buildClearCookieOptions:
    // Construye las opciones necesarias para eliminar una cookie.
    // No incluye maxAge ni expires porque esos valores pertenecen a la creación.
    // Para borrar correctamente, deben coincidir path, domain, sameSite y secure.
    // -----------------------------------------------------------------------------
    _buildClearCookieOptions(options = {}) {
        const cookieOptions = {
            path: options.path ?? '/',
            httpOnly: options.httpOnly ?? true,
        };

        if (options.sameSite !== undefined) {
            cookieOptions.sameSite = options.sameSite;
        }

        if (options.secure !== undefined) {
            cookieOptions.secure = options.secure;
        }

        if (options.domain !== undefined) {
            cookieOptions.domain = options.domain;
        }

        return cookieOptions;
    }

    // -----------------------------------------------------------------------------
    // _encryptIfNeeded:
    // Cifra el contenido cuando se solicita explícitamente.
    // -----------------------------------------------------------------------------
    _encryptIfNeeded(value, shouldEncrypt = false) {
        if (!shouldEncrypt) {
            return value;
        }

        if (!this._dataEncryption) {
            throw new ValidationError('No hay un servicio de cifrado configurado para la cookie.');
        }

        return this._dataEncryption.encryptText(value);
    }

    // -----------------------------------------------------------------------------
    // _decryptIfNeeded:
    // Descifra el contenido cuando se solicita explícitamente.
    // -----------------------------------------------------------------------------
    _decryptIfNeeded(value, shouldEncrypt = false) {
        if (!shouldEncrypt) {
            return value;
        }

        if (!this._dataEncryption) {
            throw new ValidationError('No hay un servicio de cifrado configurado para la cookie.');
        }

        return this._dataEncryption.decryptText(value);
    }
}

module.exports = CookieFactory;
