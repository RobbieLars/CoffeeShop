const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

class CreateGiftDto {
    constructor({ userId, productId, petId } = {}) {
        this.userId = userId;
        this.productId = productId;
        this.petId = petId;
    }
}

class UpdateGiftDto {
    constructor({
        userId,
        productId,
        petId,
        date,
        giftReceived,
        googlePhotoPetUrl,
        googleFolderPetUrl
    } = {}) {
        this.userId = userId;
        this.productId = productId;
        this.petId = petId;
        this.date = date;
        this.giftReceived = giftReceived;
        this.googlePhotoPetUrl = googlePhotoPetUrl;
        this.googleFolderPetUrl = googleFolderPetUrl;
    }
}

class PatchGiftReceivedDto {
    constructor({ giftReceived } = {}) {
        this.giftReceived = giftReceived;
    }
}

class GiftListItemDto {
    constructor({
        id,
        userName = null,
        productName = null,
        productImgPublicId = null,
        petName = null,
        giftReceived,
        googlePhotoPetUrl = null,
        date
    } = {}) {
        this.id = id;
        this.userName = userName;
        this.productName = productName;
        this.productImgPublicId = productImgPublicId;
        this.petName = petName;
        this.giftReceived = giftReceived;
        this.googlePhotoPetUrl = googlePhotoPetUrl;
        this.date = date;
    }
}

class GiftDetailDto {
    constructor({
        id,
        userId,
        userName = null,
        productId,
        productName = null,
        productImgPublicId = null,
        petId,
        petName = null,
        giftReceived,
        googlePhotoPetUrl = null,
        googleFolderPetUrl = null,
        date,
        audit = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.productId = productId;
        this.productName = productName;
        this.productImgPublicId = productImgPublicId;
        this.petId = petId;
        this.petName = petName;
        this.giftReceived = giftReceived;
        this.googlePhotoPetUrl = googlePhotoPetUrl;
        this.googleFolderPetUrl = googleFolderPetUrl;
        this.date = date;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreateGiftDto,
    UpdateGiftDto,
    PatchGiftReceivedDto,
    GiftListItemDto,
    GiftDetailDto
};
