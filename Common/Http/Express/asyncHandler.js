// asyncHandler.js

// Middleware para manejar funciones asíncronas en rutas de Express,
// capturando errores y pasándolos al siguiente middleware de error.
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;