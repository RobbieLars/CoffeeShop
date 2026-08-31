const CommonDtoValidator = require('../Common/CommonDtoValidator');

const PRODUCT_FIELDS = Object.freeze({

    name: {
        type: 'string',
        maxLength: 100
    },

    description: {
        type: 'string',
        maxLength: 1000
    },

    imgPublicId: {
        type: 'string',
        maxLength: 255
    },

    price: {
        type: 'number',
        min: 0,
        minMessage: 'El campo price no puede ser menor que 0.'
    },

    url: {
        type: 'string',
        maxLength: 500
    },

    enabled: {
        type: 'boolean'
    }

});

class CommonProductDtoValidator {

    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, PRODUCT_FIELDS, options);
    }
}

class CreateProductDtoValidator extends CommonProductDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: [
                'name',
                'description',
                'imgPublicId',
                'price',
                'url'
            ],
            forbiddenFields: ['enabled']
        });
    }
}

class UpdateProductDtoValidator extends CommonProductDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonProductDtoValidator,
    CreateProductDtoValidator,
    UpdateProductDtoValidator
};