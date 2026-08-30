// EmailValidator.js
// Validador común para parámetros de envío de correo.

class EmailValidator {
    // -----------------------------------------------------------------------------
    // validateSendEmail:
    // Valida un correo manual sin plantilla.
    // Espera un objeto primitivo con:
    // - to
    // - cc (opcional)
    // - bcc (opcional)
    // - subject
    // - body
    // -----------------------------------------------------------------------------
    validateSendEmail(dto) {
        const errors = [];

        if (!dto || typeof dto !== 'object' || Array.isArray(dto)) {
            errors.push('La información del correo es obligatoria y debe ser un objeto válido.');
            return errors;
        }

        this._validateRecipients(errors, dto.to, 'to', true);
        this._validateRecipients(errors, dto.cc, 'cc', false);
        this._validateRecipients(errors, dto.bcc, 'bcc', false);

        if (typeof dto.subject !== 'string' || dto.subject.trim() === '') {
            errors.push('El campo subject es obligatorio.');
        }

        if (typeof dto.body !== 'string' || dto.body.trim() === '') {
            errors.push('El campo body es obligatorio.');
        }

        return errors;
    }

    // -----------------------------------------------------------------------------
    // validateSendTemplateEmail:
    // Valida un correo enviado mediante plantilla.
    // Espera un objeto primitivo con:
    // - template
    // - to
    // - cc (opcional)
    // - bcc (opcional)
    // - subject (opcional)
    // - data
    // -----------------------------------------------------------------------------
    validateSendTemplateEmail(dto) {
        const errors = [];

        if (!dto || typeof dto !== 'object' || Array.isArray(dto)) {
            errors.push('La información del correo por plantilla es obligatoria y debe ser un objeto válido.');
            return errors;
        }

        if (typeof dto.template !== 'string' || dto.template.trim() === '') {
            errors.push('El campo template es obligatorio.');
        }

        this._validateRecipients(errors, dto.to, 'to', true);
        this._validateRecipients(errors, dto.cc, 'cc', false);
        this._validateRecipients(errors, dto.bcc, 'bcc', false);

        if (
            dto.subject !== undefined &&
            dto.subject !== null &&
            (typeof dto.subject !== 'string' || dto.subject.trim() === '')
        ) {
            errors.push('El campo subject debe ser un string válido cuando se envía informado.');
        }

        if (!dto.data || typeof dto.data !== 'object' || Array.isArray(dto.data)) {
            errors.push('El campo data es obligatorio y debe ser un objeto válido.');
        }

        return errors;
    }

    // -----------------------------------------------------------------------------
    // _validateRecipients:
    // Valida destinatarios de correo.
    // Acepta:
    // - string con un correo
    // - string con correos separados por coma
    // - array de correos
    // -----------------------------------------------------------------------------
    _validateRecipients(errors, value, fieldName, required = false) {
        if (value === undefined || value === null || value === '') {
            if (required) {
                errors.push(`El campo ${fieldName} es obligatorio.`);
            }

            return;
        }

        const recipients = Array.isArray(value)
            ? value
            : String(value).split(',');

        const normalizedRecipients = recipients
            .map(recipient => String(recipient).trim())
            .filter(Boolean);

        if (required && normalizedRecipients.length === 0) {
            errors.push(`El campo ${fieldName} es obligatorio.`);
            return;
        }

        for (const recipient of normalizedRecipients) {
            if (!this._isValidEmail(recipient)) {
                errors.push(`El campo ${fieldName} contiene un correo inválido: '${recipient}'.`);
            }
        }
    }

    // -----------------------------------------------------------------------------
    // _isValidEmail:
    // Valida formato básico de correo electrónico.
    // -----------------------------------------------------------------------------
    _isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }
}

module.exports = EmailValidator;