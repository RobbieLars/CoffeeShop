// Interfaz para ejecutar llamadas HTTP y devolver resultados controlados.

class IExternalCallExecutorService {
    constructor() {
        if (new.target === IExternalCallExecutorService) {
            throw new Error(
                'IExternalCallExecutorService no puede ser instanciada directamente.'
            );
        }
    }

    async executeAsync(_options = {}) {
        throw new Error('El metodo executeAsync debe ser implementado.');
    }
}

module.exports = IExternalCallExecutorService;
