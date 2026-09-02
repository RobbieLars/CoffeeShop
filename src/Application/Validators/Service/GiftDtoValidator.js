const CommonDtoValidator = require('../Common/CommonDtoValidator');

const GIFT_FIELDS = Object.freeze({
    userId: { type: 'objectId' },
    productId: { type: 'objectId' },
    petId: { type: 'objectId' },
    date: { type: 'date' },
    giftReceived: { type: 'boolean' },
    googlePhotoPetUrl: {
        type: 'string',
        maxLength: 1000,
        nullable: true
    },
    googleFolderPetUrl: {
        type: 'string',
        maxLength: 1000,
        nullable: true
    }
});

const PATCH_GIFT_RECEIVED_FIELDS = Object.freeze({
    giftReceived: { type: 'boolean' }
});

class CommonGiftDtoValidator {
    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, GIFT_FIELDS, options);
    }
}

class CreateGiftDtoValidator extends CommonGiftDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['userId', 'productId', 'petId']
        });
    }
}

class UpdateGiftDtoValidator extends CommonGiftDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

class PatchGiftReceivedDtoValidator {
    validate(dto) {
        return CommonDtoValidator.validate(
            dto,
            PATCH_GIFT_RECEIVED_FIELDS,
            { requiredFields: ['giftReceived'] }
        );
    }
}

module.exports = {
    CommonGiftDtoValidator,
    CreateGiftDtoValidator,
    UpdateGiftDtoValidator,
    PatchGiftReceivedDtoValidator
};
