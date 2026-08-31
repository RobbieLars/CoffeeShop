// Entidad de dominio Comment.
class Comment {
    constructor({
        id,
        userId,
        subject,
        message,
        photoPublicId = null,
        edited = false
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = edited;
    }
}

module.exports = Comment;
