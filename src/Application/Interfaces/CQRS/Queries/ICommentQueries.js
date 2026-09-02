// ICommentQueries.js

// Interfaz para consultas especializadas de Comment (CQRS).
class ICommentQueries {
    // Obtiene los datos del usuario asociados a una lista de comentarios por IDs.
    async getCommentsEnrichedByIdsQueryAsync(commentIds) {
        throw new Error('Method not implemented.');
    }

}

module.exports = ICommentQueries;
