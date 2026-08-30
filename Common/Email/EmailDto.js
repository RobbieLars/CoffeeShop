// DTO para el envío de correos electrónicos
class SendEmailDto {
    constructor({
        to,
        cc = null,
        bcc = null,
        subject,
        body
    }) {
        this.to = to;
        this.cc = cc;
        this.bcc = bcc;
        this.subject = subject;
        this.body = body;
    }
}

// DTO para el envío de correos electrónicos mediante plantillas
class SendTemplateEmailDto {
    constructor({
        template,
        to,
        cc = null,
        bcc = null,
        subject,
        data
    }) {
        this.template = template;
        this.to = to;
        this.cc = cc;
        this.bcc = bcc;
        this.subject = subject;
        this.data = data;
    }
}

module.exports = {
    SendEmailDto,
    SendTemplateEmailDto
};
