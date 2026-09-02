// Contrato de acceso a datos de Comment para consumidores como la UI.
// Puede ser implementado por una fuente real o por CommentMockService.
class ICommentDataSource {
    // Obtiene una lista paginada de comentarios.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de un comentario por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea un comentario.
    async CreateAsync(createCommentDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de un comentario.
    async UpdateAsync(id, updateCommentDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza únicamente el mensaje de un comentario.
    async PatchMessageAsync(id, patchCommentMessageDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente un comentario.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = ICommentDataSource;