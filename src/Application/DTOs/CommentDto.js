const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de un comentario
class CreateCommentDto {
    constructor({
        userId,
        message,
        photoPublicId
    } = {}) {
        this.userId = userId;
        this.message = message;
        this.photoPublicId = photoPublicId;
    }
}

// DTO para la actualización de un comentario
class UpdateCommentDto {
    constructor({
        userId,
        message,
        photoPublicId,
        enabled
    } = {}) {
        this.userId = userId;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.enabled = enabled;
    }
}

// DTO para actualización parcial (Patch) del mensaje
class PatchCommentMessageDto {
    constructor({
        message
    } = {}) {
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
        message,
        photoPublicId,
        edited = false,
        enabled = true,
        createdAt = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername;
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }
}

// DTO para los detalles de un comentario
class CommentDetailDto {
    constructor({
        id,
        userId,
        userUsername = '',
        userPhotoProfilePublicId = '',
        message,
        photoPublicId,
        edited = false,
        enabled = true,
        audit = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername;
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

// DTO para el impacto de eliminación por usuario
class UserCommentsDeleteImpactDto {
    constructor({
        userId,
        totalComments = 0
    } = {}) {
        this.userId = userId;
        this.totalComments = totalComments;
    }
}

module.exports = {
    CreateCommentDto,
    UpdateCommentDto,
    PatchCommentMessageDto,
    CommentListItemDto,
    CommentDetailDto,
    UserCommentsDeleteImpactDto
};
