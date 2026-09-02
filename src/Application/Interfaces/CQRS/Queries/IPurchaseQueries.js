// Interfaz para consultas especializadas de Purchase (CQRS).
class IPurchaseQueries {
    // Obtiene los productos, usuarios y mascotas relacionados con compras.
    async getPurchaseReferencesByIdsQueryAsync({
        productIds,
        userIds,
        petIds
    } = {}) {
        throw new Error('Method not implemented.');
    }
}

module.exports = IPurchaseQueries;
