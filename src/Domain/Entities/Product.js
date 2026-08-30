// Entidad de dominio Product.
class Product {
    constructor({
        id,
        name,
        description,
        imgPublicId,
        price,
        url,
        enabled = true,
        createdById = null,
        modifiedById = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
        this.enabled = enabled;
        this.createdById = createdById;
        this.modifiedById = modifiedById;
    }
}

module.exports = Product;
