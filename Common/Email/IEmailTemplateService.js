// IEmailTemplateService.js
// Interfaz para el servicio de envío de correos mediante plantillas.

class IEmailTemplateService {
    constructor() {
        if (new.target === IEmailTemplateService) {
            throw new Error('IEmailTemplateService no puede ser instanciada directamente.');
        }
    }

    // -----------------------------------------------------------------------------
    // sendTemplateEmailAsync:
    // Envía un correo usando una plantilla HTML y datos dinámicos.
    // -----------------------------------------------------------------------------
    async sendTemplateEmailAsync(_templateEmailData) {
        throw new Error('El método sendTemplateEmailAsync debe ser implementado.');
    }
}

module.exports = IEmailTemplateService;