// Interfaz para consultas especializadas de Pet (CQRS).
class IPetQueries {
    // Obtiene los propietarios relacionados con una lista de usuarios.
    async getOwnersByIdsQueryAsync(ownerIds) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPetQueries;
