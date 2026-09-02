// Entidad de dominio Purchase.
class Purchase {
    constructor({
        id,
        productId,
        userId,
        petId,
        day,
        photoPublicId = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
        this.day = day;
        this.photoPublicId = photoPublicId;
    }
}

module.exports = Purchase;
