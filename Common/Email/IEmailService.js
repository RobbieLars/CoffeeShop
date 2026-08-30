// IEmailService.js
// Interfaz para el servicio de envío de correos.

class IEmailService {
    constructor() {
        if (new.target === IEmailService) {
            throw new Error('IEmailService no puede ser instanciada directamente.');
        }
    }

    // -----------------------------------------------------------------------------
    // sendEmailAsync:
    // Envía un correo electrónico.
    // Debe recibir un objeto con la información del correo.
    // -----------------------------------------------------------------------------
    async sendEmailAsync(_emailData) {
        throw new Error('El método sendEmailAsync debe ser implementado.');
    }

    // -----------------------------------------------------------------------------
    // verifyConnectionAsync:
    // Verifica que la configuración del transporte de correo sea válida.
    // -----------------------------------------------------------------------------
    async verifyConnectionAsync() {
        throw new Error('El método verifyConnectionAsync debe ser implementado.');
    }
}

module.exports = IEmailService;