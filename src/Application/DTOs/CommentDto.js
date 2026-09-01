const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de un comentario
class CreateCommentDto {
    constructor({
        userId,
        subject,
        message,
        photoPublicId
    } = {}) {
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
    }
}

// DTO para la actualización de un comentario
class UpdateCommentDto {
    constructor({
        userId,
        subject,
        message,
        photoPublicId
    } = {}) {
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
    }
}

// DTO para actualización parcial (Patch) del mensaje
class PatchCommentMessageDto {
    constructor({
        subject,
        message
    } = {}) {
        this.subject = subject;
        this.message = message;
    }
}

// DTO para los elementos de la lista de comentarios (enriquecido con datos del autor)
class CommentListItemDto {
    constructor({
        id,
        userId,
        userUsername = '',
        userPhotoProfilePublicId = '',
        subject,
        message,
        photoPublicId,
        edited = false,
        createdAt = null,
        actions = []
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername;
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;
        this.createdAt = createdAt;
        this.actions = Array.isArray(actions) ? actions : [];
    }
}

// DTO para los detalles de un comentario
class CommentDetailDto {
    constructor({
        id,
        userId,
        userUsername = '',
        userPhotoProfilePublicId = '',
        subject,
        message,
        photoPublicId,
        edited = false,
        audit = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername;
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreateCommentDto,
    UpdateCommentDto,
    PatchCommentMessageDto,
    CommentListItemDto,
    CommentDetailDto
};
