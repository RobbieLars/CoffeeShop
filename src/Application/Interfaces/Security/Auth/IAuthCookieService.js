// IAuthCookieService.js

// Interfaz para servicios de manejo de cookies de autenticación.
class IAuthCookieService {
    // -----------------------------------------------------------------------------
    // setRefreshTokenCookie:
    // Crea la cookie HttpOnly del refresh token.
    // -----------------------------------------------------------------------------
    setRefreshTokenCookie(res, refreshToken) {
        throw new Error('Método setRefreshTokenCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // setAccessTokenCookie:
    // Crea la cookie HttpOnly del access token.
    // -----------------------------------------------------------------------------
    setAccessTokenCookie(res, accessToken) {
        throw new Error('Método setAccessTokenCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // setAuthCookies:
    // Crea las cookies de autenticación disponibles según los tokens recibidos.
    // -----------------------------------------------------------------------------
    setAuthCookies(res, tokens) {
        throw new Error('Método setAuthCookies no implementado.');
    }

    // -----------------------------------------------------------------------------
    // clearRefreshTokenCookie:
    // Elimina la cookie del refresh token.
    // -----------------------------------------------------------------------------
    clearRefreshTokenCookie(res) {
        throw new Error('Método clearRefreshTokenCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // clearAccessTokenCookie:
    // Elimina la cookie del access token.
    // -----------------------------------------------------------------------------
    clearAccessTokenCookie(res) {
        throw new Error('Método clearAccessTokenCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // clearAuthCookies:
    // Elimina todas las cookies de autenticación.
    // -----------------------------------------------------------------------------
    clearAuthCookies(res) {
        throw new Error('Método clearAuthCookies no implementado.');
    }

    // -----------------------------------------------------------------------------
    // getRefreshTokenFromRequest:
    // Obtiene el refresh token desde las cookies de la petición.
    // -----------------------------------------------------------------------------
    getRefreshTokenFromRequest(req) {
        throw new Error('Método getRefreshTokenFromRequest no implementado.');
    }

    // -----------------------------------------------------------------------------
    // getAccessTokenFromRequest:
    // Obtiene el access token desde las cookies de la petición.
    // -----------------------------------------------------------------------------
    getAccessTokenFromRequest(req) {
        throw new Error('Método getAccessTokenFromRequest no implementado.');
    }
}

module.exports = IAuthCookieService;
