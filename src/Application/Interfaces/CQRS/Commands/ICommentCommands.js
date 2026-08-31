// ICommentCommands.js

// Interfaz para comandos de efectos secundarios de Comment (CQRS).
class ICommentCommands {
    // Elimina permanentemente todos los comentarios de un usuario.
    async deleteCommentsByUserIdCommandAsync(userId) {
        throw new Error('Method not implemented.');
    }

    // Inhabilita lógicamente todos los comentarios de un usuario.
    async disableCommentsByUserIdCommandAsync(userId) {
        throw new Error('Method not implemented.');
    }
}

module.exports = ICommentCommands;
