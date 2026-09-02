// Contrato de acceso a datos de Purchase para consumidores como la UI.
// Puede ser implementado por una fuente real o por PurchaseMockService.
class IPurchaseDataSource {
    // Obtiene una lista paginada de compras.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de una compra por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea una compra.
    async CreateAsync(createPurchaseDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de una compra.
    async UpdateAsync(id, updatePurchaseDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente una compra.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPurchaseDataSource;