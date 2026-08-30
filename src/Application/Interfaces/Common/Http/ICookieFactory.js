// ICookieFactory.js

// Interfaz para la fábrica de cookies en HTTP.
// Define métodos para crear, obtener y limpiar cookies con objetos como payload.
class ICookieFactory {
    // -----------------------------------------------------------------------------
    // createObjectCookie:
    // Crea la cookie con un objeto como payload en la respuesta HTTP.
    // -----------------------------------------------------------------------------
    createObjectCookie(res, cookieName, payload, options = {}) {
        throw new Error('Método createObjectCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // getObjectCookie:
    // Obtiene la cookie con un objeto como payload de la solicitud HTTP.
    // -----------------------------------------------------------------------------
    getObjectCookie(req, cookieName, options = {}) {
        throw new Error('Método getObjectCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // clearCookie:
    // Limpia la cookie en la respuesta HTTP.
    // -----------------------------------------------------------------------------
    clearCookie(res, cookieName, options = {}) {
        throw new Error('Método clearCookie no implementado.');
    }
}

module.exports = ICookieFactory;