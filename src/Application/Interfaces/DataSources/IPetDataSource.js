// Contrato de acceso a datos de Pet para consumidores como la UI.
// Puede ser implementado por una fuente real o por PetMockService.
class IPetDataSource {
    // Obtiene una lista paginada de mascotas.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de una mascota por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea una mascota.
    async CreateAsync(createPetDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de una mascota.
    async UpdateAsync(id, updatePetDto) {
        throw new Error('Method not implemented.');
    }

    // Cambia únicamente el propietario de una mascota.
    async PatchOwnerAsync(id, patchPetOwnerDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente una mascota.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPetDataSource;