const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de un producto
class CreateProductDto {
    constructor({
        name,
        description,
        imgPublicId,
        price,
        url
    } = {}) {
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
    }
}

// DTO para la actualización de un producto
class UpdateProductDto {
    constructor({
        name,
        description,
        imgPublicId,
        price,
        url,
        enabled
    } = {}) {
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
        this.enabled = enabled;
    }
}

// DTO para los elementos de la lista de productos
class ProductListItemDto {
    constructor({
        id,
        name,
        imgPublicId,
        price,
        enabled
    } = {}) {
        this.id = id;
        this.name = name;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.enabled = enabled;
    }
}

// DTO para los detalles de un producto
class ProductDetailDto {
    constructor({
        id,
        name,
        description,
        imgPublicId,
        price,
        url,
        enabled,
        audit = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreateProductDto,
    UpdateProductDto,
    ProductListItemDto,
    ProductDetailDto
};
