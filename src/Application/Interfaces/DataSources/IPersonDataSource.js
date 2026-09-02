// Contrato de acceso a datos de Person para consumidores como la UI.
// Puede ser implementado por una fuente real o por PersonMockService.
class IPersonDataSource {
    // Obtiene una lista paginada de personas.
    async GetPagedAsync(paginationData) {
        throw new Error('Method not implemented.');
    }

    // Obtiene los detalles de una persona por su ID.
    async GetByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // Crea una persona.
    async CreateAsync(createPersonDto) {
        throw new Error('Method not implemented.');
    }

    // Actualiza los campos proporcionados de una persona.
    async UpdateAsync(id, updatePersonDto) {
        throw new Error('Method not implemented.');
    }

    // Elimina permanentemente una persona.
    async HardDeleteAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPersonDataSource;