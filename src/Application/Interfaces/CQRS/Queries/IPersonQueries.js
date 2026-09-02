// Interfaz para consultas especializadas de Person (CQRS).
class IPersonQueries {
    // Obtiene los usuarios relacionados con una lista de personas.
    async getUsersByPersonIdsQueryAsync(personIds) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPersonQueries;
