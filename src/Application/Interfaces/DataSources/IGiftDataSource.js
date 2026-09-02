// Contrato de acceso a datos de Gift para consumidores como la UI.
// Puede ser implementado por una fuente real o por GiftMockService.
class IGiftDataSource {
    // Obtiene una lista paginada de regalos.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de un regalo por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea un regalo.
    async CreateAsync(createGiftDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de un regalo.
    async UpdateAsync(id, updateGiftDto) {
        throw new Error('Method not implemented.');
    }

    // Cambia el estado giftReceived de un regalo.
    async PatchReceivedAsync(id, patchGiftReceivedDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente un regalo.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IGiftDataSource;