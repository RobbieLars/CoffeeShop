const CommonDtoValidator = require('../Common/CommonDtoValidator');

const PET_FIELDS = Object.freeze({
    photoPublicId: {
        type: 'string',
        maxLength: 255,
        nullable: true
    },
    name: {
        type: 'string',
        maxLength: 50
    },
    type: {
        type: 'number',
        integer: true
    },
    breed: {
        type: 'number',
        integer: true
    },
    birthDate: {
        type: 'date',
        nullable: true
    },
    gender: {
        type: 'number',
        integer: true
    },
    weight: {
        type: 'number',
        min: 0,
        nullable: true
    },
    favoriteFood: {
        type: 'string',
        maxLength: 100,
        nullable: true
    },
    enabled: {
        type: 'boolean'
    }
});

class CommonPetDtoValidator {
    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, PET_FIELDS, options);
    }
}

class CreatePetDtoValidator extends CommonPetDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['name', 'type', 'breed', 'gender'],
            forbiddenFields: ['enabled']
        });
    }
}

class UpdatePetDtoValidator extends CommonPetDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonPetDtoValidator,
    CreatePetDtoValidator,
    UpdatePetDtoValidator
};
