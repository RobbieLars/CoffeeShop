// Interfaz para operaciones HTTP reutilizables.

class IHttpClientService {
    constructor() {
        if (new.target === IHttpClientService) {
            throw new Error(
                'IHttpClientService no puede ser instanciada directamente.'
            );
        }
    }

    // -----------------------------------------------------------------------------
    // requestAsync:
    // Ejecuta una petición HTTP utilizando el método y las opciones indicadas.
    // -----------------------------------------------------------------------------
    async requestAsync(_method, _address, _options = {}) {
        throw new Error('El método requestAsync debe ser implementado.');
    }

    async getAsync(_address, _options = {}) {
        throw new Error('El método getAsync debe ser implementado.');
    }

    async postAsync(_address, _body, _options = {}) {
        throw new Error('El método postAsync debe ser implementado.');
    }

    async putAsync(_address, _body, _options = {}) {
        throw new Error('El método putAsync debe ser implementado.');
    }

    async patchAsync(_address, _body, _options = {}) {
        throw new Error('El método patchAsync debe ser implementado.');
    }

    async deleteAsync(_address, _options = {}) {
        throw new Error('El método deleteAsync debe ser implementado.');
    }
}

module.exports = IHttpClientService;
