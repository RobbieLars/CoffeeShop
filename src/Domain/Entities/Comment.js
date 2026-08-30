// Entidad de dominio Comment.
class Comment {
    constructor({
        id,
        userId,
        message,
        photoPublicId = null,
        createdById = null,
        modifiedById = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.createdById = createdById;
        this.modifiedById = modifiedById;
    }
}

module.exports = Comment;
