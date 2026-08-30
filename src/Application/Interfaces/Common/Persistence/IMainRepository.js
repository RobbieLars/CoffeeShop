// Contrato genérico para repositorios genéricos.
// Define las operaciones CRUD que la capa Application puede esperar.

class IMainRepository {
    // -----------------------------------------------------------------------------
    // Paginación.
    // Permite obtener una página aplicando criterios neutrales de búsqueda.
    // -----------------------------------------------------------------------------
    async getPagedAsync(page, pageSize, searchCriteria = {}) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Obtener todos los elementos.
    // Devuelve todos los elementos que coinciden con el filtro opcional.
    // -----------------------------------------------------------------------------
    async getAllAsync(filter = {}) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Obtener un elemento por su ID.
    // Devuelve un solo elemento que coincide con el ID proporcionado.
    // -----------------------------------------------------------------------------
    async getByIdAsync(id) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Obtener un elemento por su ID con información de auditoría.
    // Devuelve un solo elemento que coincide con el ID proporcionado, junto con información de auditoría (como fecha de creación, fecha de actualización, etc.).
    // -----------------------------------------------------------------------------
    async getByIdWithAuditAsync(id) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Obtener un elemento por su ID con auditoria completa.
    // Incluye timestamps y los nombres de los usuarios que crearon o actualizaron.
    // -----------------------------------------------------------------------------
    async getByIdWithCompleteAuditAsync(id) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Crear un nuevo elemento.
    // Agrega un nuevo elemento al repositorio y devuelve el elemento creado (con ID asignado).
    // -----------------------------------------------------------------------------
    async createAsync(entity) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Actualizar un elemento por su ID.
    // Reemplaza completamente un elemento existente con los datos proporcionados.
    // -----------------------------------------------------------------------------
    async updateByIdAsync(id, entity) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Actualización parcial de un elemento por su ID.
    // Permite actualizar solo ciertos campos de un elemento existente sin reemplazarlo completamente.
    // -----------------------------------------------------------------------------
    async patchByIdAsync(id, partialData) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Actualización parcial de múltiples elementos que coinciden con un filtro.
    // Permite actualizar ciertos campos de múltiples elementos que cumplen
    // con un criterio de filtro sin reemplazarlos completamente.
    // -----------------------------------------------------------------------------
    async patchManyAsync(filter, partialData) {
        throw new Error('Method not implemented.');
    }

    // -----------------------------------------------------------------------------
    // Eliminar un elemento por su ID.
    // Elimina un elemento del repositorio que coincide con el ID proporcionado.
    // -----------------------------------------------------------------------------
    async deleteByIdAsync(id) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IMainRepository;
