// AuthCookieService.js

const IAuthCookieService = require('../Interface/IAuthCookieService');
const { ValidationError } = require('../../Errors/ApplicationErrors');

class AuthCookieService extends IAuthCookieService {
    constructor(cookieService, config = {}) {
        super();

        if (!cookieService) {
            throw new ValidationError('El servicio de cookies es obligatorio.');
        }

        this._cookieService = cookieService;
        this._config = {
            accessTokenCookieName: config.accessTokenCookieName || 'accessToken',
            refreshTokenCookieName: config.refreshTokenCookieName || 'refreshToken',
            accessTokenMaxAge: config.accessTokenMaxAge ?? 15 * 60 * 1000,
            refreshTokenMaxAge: config.refreshTokenMaxAge ?? 7 * 24 * 60 * 60 * 1000,
            path: config.path || '/',
            ...config,
        };
    }

    // -----------------------------------------------------------------------------
    // setRefreshTokenCookie:
    // Crea la cookie HttpOnly del refresh token.
    // -----------------------------------------------------------------------------
    setRefreshTokenCookie(res, refreshToken) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!refreshToken) {
            throw new ValidationError('El refresh token es obligatorio.');
        }

        this._cookieService.setCookie(
            res,
            this._config.refreshTokenCookieName,
            refreshToken,
            {
                path: this._config.path,
                maxAge: this._config.refreshTokenMaxAge,
            }
        );
    }

    // -----------------------------------------------------------------------------
    // setAccessTokenCookie:
    // Crea la cookie HttpOnly del access token.
    // -----------------------------------------------------------------------------
    setAccessTokenCookie(res, accessToken) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!accessToken) {
            throw new ValidationError('El access token es obligatorio.');
        }

        this._cookieService.setCookie(
            res,
            this._config.accessTokenCookieName,
            accessToken,
            {
                path: this._config.path,
                maxAge: this._config.accessTokenMaxAge,
            }
        );
    }

    // -----------------------------------------------------------------------------
    // setAuthCookies:
    // Crea las cookies de autenticación disponibles según los tokens recibidos.
    // -----------------------------------------------------------------------------
    setAuthCookies(res, tokens) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        if (!tokens) {
            throw new ValidationError('Los tokens son obligatorios.');
        }

        if (tokens.refreshToken) {
            this.setRefreshTokenCookie(res, tokens.refreshToken);
        }

        if (tokens.accessToken) {
            this.setAccessTokenCookie(res, tokens.accessToken);
        }
    }

    // -----------------------------------------------------------------------------
    // clearRefreshTokenCookie:
    // Elimina la cookie del refresh token.
    // -----------------------------------------------------------------------------
    clearRefreshTokenCookie(res) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        this._cookieService.clearCookie(
            res,
            this._config.refreshTokenCookieName,
            {
                path: this._config.path,
            }
        );
    }

    // -----------------------------------------------------------------------------
    // clearAccessTokenCookie:
    // Elimina la cookie del access token.
    // -----------------------------------------------------------------------------
    clearAccessTokenCookie(res) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        this._cookieService.clearCookie(
            res,
            this._config.accessTokenCookieName,
            {
                path: this._config.path,
            }
        );
    }

    // -----------------------------------------------------------------------------
    // clearAuthCookies:
    // Elimina todas las cookies de autenticación.
    // -----------------------------------------------------------------------------
    clearAuthCookies(res) {
        if (!res) {
            throw new ValidationError('La respuesta HTTP es obligatoria.');
        }

        this.clearRefreshTokenCookie(res);
        this.clearAccessTokenCookie(res);
    }

    // -----------------------------------------------------------------------------
    // getRefreshTokenFromRequest:
    // Obtiene el refresh token desde las cookies de la petición.
    // -----------------------------------------------------------------------------
    getRefreshTokenFromRequest(req) {
        return this._cookieService.getCookie(req, this._config.refreshTokenCookieName);
    }

    // -----------------------------------------------------------------------------
    // getAccessTokenFromRequest:
    // Obtiene el access token desde las cookies de la petición.
    // -----------------------------------------------------------------------------
    getAccessTokenFromRequest(req) {
        return this._cookieService.getCookie(req, this._config.accessTokenCookieName);
    }
}

module.exports = AuthCookieService;
