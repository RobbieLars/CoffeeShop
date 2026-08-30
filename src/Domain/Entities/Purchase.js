// Entidad de dominio Purchase.
class Purchase {
    constructor({
        id,
        productId,
        userId,
        day,
        photoPublicId = null,
        createdById = null,
        modifiedById = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.day = day;
        this.photoPublicId = photoPublicId;
        this.createdById = createdById;
        this.modifiedById = modifiedById;
    }
}

module.exports = Purchase;
