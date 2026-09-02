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
        productName,
        userName,
        petName,
        day
    } = {}) {
        this.id = id;
        this.productName = productName;
        this.userName = userName;
        this.petName = petName;
        this.day = day;
    }
}

// DTO para los detalles de una compra
class PurchaseDetailDto {
    constructor({
        id,
        productId,
        productName,
        userId,
        userName,
        petId,
        petName,
        day,
        photoPublicId,
        audit = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.userId = userId;
        this.userName = userName;
        this.petId = petId;
        this.petName = petName;
        this.day = day;
        this.photoPublicId = photoPublicId;

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
