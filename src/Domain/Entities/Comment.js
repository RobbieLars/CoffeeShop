// Entidad de dominio Comment.
class Comment {
    constructor({
        id,
        userId,
        message,
        photoPublicId = null,
        edited = false,
        enabled = true
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;
        this.enabled = enabled;
    }
}

module.exports = Comment;
