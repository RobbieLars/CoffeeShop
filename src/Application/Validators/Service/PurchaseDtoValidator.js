const CommonDtoValidator = require('../Common/CommonDtoValidator');

const PURCHASE_FIELDS = Object.freeze({
    productId: {
        type: 'objectId'
    },
    userId: {
        type: 'objectId'
    },
    petId: {
        type: 'objectId'
    },
    day: {
        type: 'date'
    },
    photoPublicId: {
        type: 'string',
        maxLength: 255,
        nullable: true
    }
});

class CommonPurchaseDtoValidator {
    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, PURCHASE_FIELDS, options);
    }
}

class CreatePurchaseDtoValidator extends CommonPurchaseDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: [
                'productId',
                'userId',
                'petId'
            ],
            forbiddenFields: [
                'day',
                'photoPublicId'
            ]
        });
    }
}

class UpdatePurchaseDtoValidator extends CommonPurchaseDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonPurchaseDtoValidator,
    CreatePurchaseDtoValidator,
    UpdatePurchaseDtoValidator
};
