// NodemailerEmailService.js
// Implementación reutilizable para envío de correos con Nodemailer.

const nodemailer = require('nodemailer');
const IEmailService = require('./IEmailService');

class NodemailerEmailService extends IEmailService {
    // -----------------------------------------------------------------------------
    // constructor:
    // Recibe la configuración del correo y opcionalmente un transporter.
    // Necesaria para pruebas unitarias mediante mockeo.
    // -----------------------------------------------------------------------------
    constructor(emailConfig, transporter = null) {
        super();

        if (!emailConfig || typeof emailConfig !== 'object' || Array.isArray(emailConfig)) {
            throw new Error('NodemailerEmailService requiere una configuración de correo válida.');
        }

        this._emailConfig = emailConfig;
        this._transporter = transporter || this._createTransporter(emailConfig);
    }

    // -----------------------------------------------------------------------------
    // sendEmailAsync:
    // Envía un correo electrónico validando y normalizando los datos de entrada.
    // -----------------------------------------------------------------------------
    async sendEmailAsync(emailData) {
        const normalizedEmailData = this._normalizeEmailData(emailData);
        const mailOptions = this._buildMailOptions(normalizedEmailData);

        const result = await this._transporter.sendMail(mailOptions);

        return {
            messageId: result.messageId,
            accepted: result.accepted || [],
            rejected: result.rejected || [],
            response: result.response || ''
        };
    }

    // -----------------------------------------------------------------------------
    // verifyConnectionAsync:
    // Verifica conectividad y credenciales del transporter.
    // -----------------------------------------------------------------------------
    async verifyConnectionAsync() {
        await this._transporter.verify();
        return true;
    }

    // -----------------------------------------------------------------------------
    // _createTransporter:
    // Crea la instancia de Nodemailer usando la configuración centralizada.
    // -----------------------------------------------------------------------------
    _createTransporter(emailConfig) {
        return nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.appPassword
            },
            connectionTimeout: emailConfig.connectionTimeoutMs
        });
    }

    // -----------------------------------------------------------------------------
    // _buildMailOptions:
    // Construye el objeto final que Nodemailer utilizará para enviar el correo.
    // -----------------------------------------------------------------------------
    _buildMailOptions(emailData) {
        return {
            from: emailData.from || this._buildDefaultFrom(),
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            replyTo: emailData.replyTo,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
            attachments: emailData.attachments
        };
    }

    // -----------------------------------------------------------------------------
    // _normalizeEmailData:
    // Valida y normaliza la información del correo entrante.
    // -----------------------------------------------------------------------------
    _normalizeEmailData(emailData) {
        if (!emailData || typeof emailData !== 'object') {
            throw new Error('La información del correo es obligatoria.');
        }

        const to = this._normalizeRecipients(emailData.to, 'to', true);
        const cc = this._normalizeRecipients(emailData.cc, 'cc');
        const bcc = this._normalizeRecipients(emailData.bcc, 'bcc');
        const replyTo = this._normalizeOptionalEmail(emailData.replyTo, 'replyTo');
        const from = this._normalizeOptionalFrom(emailData.from);
        const subject = this._normalizeRequiredString(emailData.subject, 'subject');
        const text = this._normalizeOptionalString(emailData.text);
        const html = this._normalizeOptionalString(emailData.html);
        const attachments = this._normalizeAttachments(emailData.attachments);

        if (!text && !html) {
            throw new Error('El correo debe incluir al menos "text" o "html".');
        }

        return {
            from,
            to,
            cc,
            bcc,
            replyTo,
            subject,
            text,
            html,
            attachments
        };
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
            throw new Error(
                `El campo '${fieldName}' debe contener un correo válido.`
            );
        }

        return normalizedValue;
    }

    // -----------------------------------------------------------------------------
    // _normalizeOptionalFrom:
    // Permite usar un "from" personalizado si viene informado.
    // -----------------------------------------------------------------------------
    _normalizeOptionalFrom(value) {
        if (value === undefined || value === null || String(value).trim() === '') {
            return undefined;
        }

        return String(value).trim();
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
    // _normalizeAttachments:
    // Valida el arreglo de adjuntos si existe.
    // -----------------------------------------------------------------------------
    _normalizeAttachments(value) {
        if (value === undefined || value === null) {
            return undefined;
        }

        if (!Array.isArray(value)) {
            throw new Error('El campo "attachments" debe ser un arreglo.');
        }

        return value.map((attachment, index) => {
            if (!attachment || typeof attachment !== 'object') {
                throw new Error(
                    `El adjunto en la posición ${index} debe ser un objeto válido.`
                );
            }

            if (!attachment.path && !attachment.content) {
                throw new Error(
                    `El adjunto en la posición ${index} debe incluir "path" o "content".`
                );
            }

            return attachment;
        });
    }

    // -----------------------------------------------------------------------------
    // _buildDefaultFrom:
    // Construye el remitente por defecto usando la configuración.
    // -----------------------------------------------------------------------------
    _buildDefaultFrom() {
        const { fromName, fromEmail } = this._emailConfig;

        if (!fromName) {
            return fromEmail;
        }

        return `"${fromName}" <${fromEmail}>`;
    }

    // -----------------------------------------------------------------------------
    // _isValidEmail:
    // Valida formato básico de correo electrónico.
    // -----------------------------------------------------------------------------
    _isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}

module.exports = NodemailerEmailService;
