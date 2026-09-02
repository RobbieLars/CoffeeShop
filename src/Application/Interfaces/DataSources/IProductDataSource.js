// Contrato de acceso a datos de Product para consumidores como la UI.
// Puede ser implementado por una fuente real o por ProductMockService.
class IProductDataSource {
    // Obtiene una lista paginada de productos.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de un producto por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea un producto.
    async CreateAsync(createProductDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de un producto.
    async UpdateAsync(id, updateProductDto) {
        throw new Error('Method not implemented.');
    }

    // Inhabilita un producto.
    async SoftDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Cambia el estado enabled de un producto.
    async PatchEnabledAsync(id, commonEnabledDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente un producto.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IProductDataSource;