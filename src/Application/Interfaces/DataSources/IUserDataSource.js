// Contrato de acceso a datos de User para consumidores como la UI.
// Puede ser implementado por una fuente real o por UserMockService.
class IUserDataSource {
    // Obtiene una lista paginada de usuarios.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de un usuario por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea un usuario.
    async CreateAsync(createUserDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de un usuario.
    async UpdateAsync(id, updateUserDto) {
        throw new Error('Method not implemented.');
    }

    // Inhabilita un usuario.
    async SoftDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Cambia el estado enabled de un usuario.
    async PatchEnabledAsync(id, commonEnabledDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente un usuario.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IUserDataSource;