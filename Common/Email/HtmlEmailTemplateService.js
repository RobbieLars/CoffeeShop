// HtmlEmailTemplateService.js
// Servicio que carga plantillas HTML desde assets, reemplaza placeholders
// y delega el envío final al servicio de correo genérico.

const fs = require('node:fs/promises');
const path = require('node:path');

const IEmailTemplateService = require('./IEmailTemplateService');
const IEmailService = require('./IEmailService');

class HtmlEmailTemplateService extends IEmailTemplateService {
    // -----------------------------------------------------------------------------
    // constructor:
    // Recibe el servicio de envío de correos para delegar el envío final.
    // -----------------------------------------------------------------------------
    constructor(emailService, options = {}) {
        super();

        if (!(emailService instanceof IEmailService)) {
            throw new Error('HtmlEmailTemplateService requiere una implementación válida de IEmailService.');
        }

        const { templatesDirectory, templateRegistry } = options;

        if (typeof templatesDirectory !== 'string' || templatesDirectory.trim() === '') {
            throw new Error('HtmlEmailTemplateService requiere un directorio de plantillas válido.');
        }

        if (
            !templateRegistry ||
            typeof templateRegistry !== 'object' ||
            Array.isArray(templateRegistry)
        ) {
            throw new Error('HtmlEmailTemplateService requiere un catálogo de plantillas válido.');
        }

        this._emailService = emailService;
        this._templatesDirectory = path.resolve(templatesDirectory);
        this._templateRegistry = templateRegistry;
    }

    // -----------------------------------------------------------------------------
    // sendTemplateEmailAsync:
    // Carga la plantilla, reemplaza sus variables y envía el correo.
    // -----------------------------------------------------------------------------
    async sendTemplateEmailAsync(templateEmailData) {
        const normalizedData = this._normalizeTemplateEmailData(templateEmailData);
        const templateDefinition = this._getTemplateDefinition(normalizedData.template);
        const templateContent = await this._readTemplateAsync(templateDefinition.fileName);
        const renderedHtml = this._renderTemplate(templateContent, normalizedData.data);

        return await this._emailService.sendEmailAsync({
            to: normalizedData.to,
            cc: normalizedData.cc,
            bcc: normalizedData.bcc,
            replyTo: normalizedData.replyTo,
            subject: normalizedData.subject || templateDefinition.defaultSubject,
            html: renderedHtml
        });
    }

    // -----------------------------------------------------------------------------
    // _normalizeTemplateEmailData:
    // Valida la información requerida para el correo por plantilla.
    // -----------------------------------------------------------------------------
    _normalizeTemplateEmailData(templateEmailData) {
        if (!templateEmailData || typeof templateEmailData !== 'object') {
            throw new Error('La información del correo por plantilla es obligatoria.');
        }

        const template = this._normalizeRequiredString(
            templateEmailData.template,
            'template'
        );

        const to = this._normalizeRecipients(
            templateEmailData.to,
            'to',
            true
        );

        const cc = this._normalizeRecipients(
            templateEmailData.cc,
            'cc',
            false
        );

        const bcc = this._normalizeRecipients(
            templateEmailData.bcc,
            'bcc',
            false
        );

        const replyTo = this._normalizeOptionalEmail(
            templateEmailData.replyTo,
            'replyTo'
        );

        const subject = this._normalizeOptionalString(templateEmailData.subject);
        const data = this._normalizeDataObject(templateEmailData.data);

        return {
            template,
            to,
            cc,
            bcc,
            replyTo,
            subject,
            data
        };
    }

    // -----------------------------------------------------------------------------
    // _getTemplateDefinition:
    // Resuelve qué archivo HTML y asunto por defecto corresponden
    // al tipo de plantilla solicitado.
    // -----------------------------------------------------------------------------
    _getTemplateDefinition(template) {
        const definition = this._templateRegistry[template];

        if (!definition) {
            throw new Error(`La plantilla '${template}' no está registrada.`);
        }

        if (typeof definition.fileName !== 'string' || definition.fileName.trim() === '') {
            throw new Error(`La plantilla '${template}' no tiene un archivo válido.`);
        }

        return definition;
    }

    // -----------------------------------------------------------------------------
    // _readTemplateAsync:
    // Lee el archivo HTML de la plantilla desde assets.
    // -----------------------------------------------------------------------------
    async _readTemplateAsync(fileName) {
        const fullPath = path.join(this._templatesDirectory, fileName);

        try {
            return await fs.readFile(fullPath, 'utf8');
        } catch {
            throw new Error(`No se pudo leer la plantilla de correo '${fileName}'.`);
        }
    }

    // -----------------------------------------------------------------------------
    // _renderTemplate:
    // Reemplaza placeholders del tipo {{key}} con los datos enviados.
    // -----------------------------------------------------------------------------
    _renderTemplate(templateContent, data) {
        let renderedTemplate = templateContent;

        for (const [key, value] of Object.entries(data)) {
            const safeValue = this._escapeHtml(String(value));
            const placeholderRegex = new RegExp(`{{\\s*${this._escapeRegex(key)}\\s*}}`, 'g');
            renderedTemplate = renderedTemplate.replace(
                placeholderRegex,
                () => safeValue
            );
        }

        const remainingPlaceholders = renderedTemplate.match(/{{\s*[\w.]+\s*}}/g);

        if (remainingPlaceholders && remainingPlaceholders.length > 0) {
            throw new Error(
                `Faltan valores para los siguientes placeholders: ${remainingPlaceholders.join(', ')}.`
            );
        }

        return renderedTemplate;
    }

    // -----------------------------------------------------------------------------
    // _normalizeDataObject:
    // Valida el objeto de datos dinámicos para la plantilla.
    // -----------------------------------------------------------------------------
    _normalizeDataObject(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('El campo \'data\' es obligatorio y debe ser un objeto válido.');
        }

        return data;
    }

    // -----------------------------------------------------------------------------
    // _normalizeRecipients:
    // Acepta string, string separado por comas o array de correos.
    // -----------------------------------------------------------------------------
    _normalizeRecipients(value, fieldName, required = false) {
        if (value === undefined || value === null || value === '') {
            if (required) {
                throw new Error(`El campo '${fieldName}' es obligatorio.`);
            }

            return undefined;
        }

        const recipients = Array.isArray(value)
            ? value
            : String(value).split(',');

        const normalizedRecipients = recipients
            .map(recipient => String(recipient).trim().toLowerCase())
            .filter(Boolean);

        if (required && normalizedRecipients.length === 0) {
            throw new Error(`El campo '${fieldName}' es obligatorio.`);
        }

        for (const recipient of normalizedRecipients) {
            if (!this._isValidEmail(recipient)) {
                throw new Error(
                    `El campo '${fieldName}' contiene un correo inválido: '${recipient}'.`
                );
            }
        }

        return normalizedRecipients.length > 0
            ? normalizedRecipients
            : undefined;
    }

    // -----------------------------------------------------------------------------
    // _normalizeOptionalEmail:
    // Valida un correo opcional.
    // -----------------------------------------------------------------------------
    _normalizeOptionalEmail(value, fieldName) {
        if (value === undefined || value === null || String(value).trim() === '') {
            return undefined;
        }

        const normalizedValue = String(value).trim().toLowerCase();

        if (!this._isValidEmail(normalizedValue)) {
            throw new Error(`El campo '${fieldName}' debe contener un correo válido.`);
        }

        return normalizedValue;
    }

    // -----------------------------------------------------------------------------
    // _normalizeRequiredString:
    // Valida strings obligatorios.
    // -----------------------------------------------------------------------------
    _normalizeRequiredString(value, fieldName) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error(`El campo '${fieldName}' es obligatorio.`);
        }

        return value.trim();
    }

    // -----------------------------------------------------------------------------
    // _normalizeOptionalString:
    // Normaliza strings opcionales.
    // -----------------------------------------------------------------------------
    _normalizeOptionalString(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            return undefined;
        }

        return value.trim();
    }

    // -----------------------------------------------------------------------------
    // _isValidEmail:
    // Valida formato básico de correo electrónico.
    // -----------------------------------------------------------------------------
    _isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // -----------------------------------------------------------------------------
    // _escapeRegex:
    // Escapa texto para construir expresiones regulares seguras.
    // -----------------------------------------------------------------------------
    _escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // -----------------------------------------------------------------------------
    // _escapeHtml:
    // Escapa caracteres especiales antes de inyectarlos en HTML.
    // -----------------------------------------------------------------------------
    _escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

module.exports = HtmlEmailTemplateService;
