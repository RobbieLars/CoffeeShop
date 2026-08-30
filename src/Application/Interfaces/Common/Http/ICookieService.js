// ICookieService.js

// Interfaz para servicios de manejo de cookies en HTTP.
// Define métodos genéricos para establecer, limpiar y obtener cookies.
class ICookieService {
    // -----------------------------------------------------------------------------
    // setCookie:
    // Crea una cookie genérica con las opciones proporcionadas.
    // -----------------------------------------------------------------------------
    setCookie(res, name, value, options = {}) {
        throw new Error('Método setCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // getCookie:
    // Obtiene una cookie genérica desde la petición.
    // -----------------------------------------------------------------------------
    getCookie(req, name) {
        throw new Error('Método getCookie no implementado.');
    }

    // -----------------------------------------------------------------------------
    // clearCookie:
    // Limpia una cookie genérica.
    // -----------------------------------------------------------------------------
    clearCookie(res, name, options = {}) {
        throw new Error('Método clearCookie no implementado.');
    }
}

module.exports = ICookieService;
