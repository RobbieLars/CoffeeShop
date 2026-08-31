const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de una compra
class CreatePurchaseDto {
    constructor({
        productId,
        userId,
        petId
    } = {}) {
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
    }
}

// DTO para la actualización de una compra
class UpdatePurchaseDto {
    constructor({
        productId,
        userId,
        petId,
        day,
        photoPublicId
    } = {}) {
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
        this.day = day;
        this.photoPublicId = photoPublicId;
    }
}

// DTO para los elementos de la lista de compras
class PurchaseListItemDto {
    constructor({
        id,
        productId,
        userId,
        petId,
        day
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
        this.day = day;
    }
}

// DTO para los detalles de una compra
class PurchaseDetailDto {
    constructor({
        id,
        productId,
        userId,
        petId,
        day,
        photoPublicId,
        enabled,
        audit = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
        this.day = day;
        this.photoPublicId = photoPublicId;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreatePurchaseDto,
    UpdatePurchaseDto,
    PurchaseListItemDto,
    PurchaseDetailDto
};
