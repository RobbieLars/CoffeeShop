const CommonDtoValidator = require('../Common/CommonDtoValidator');
const PetType = require('../../../Domain/Constants/PetType');

const PET_FIELDS = Object.freeze({
    ownerId: {
        type: 'objectId'
    },
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
    privacy: {
        type: 'boolean'
    }
});

class CommonPetDtoValidator {
    validateCommonFields(dto, options = {}) {
        const errors = CommonDtoValidator.validate(dto, PET_FIELDS, options);

        if (
            CommonDtoValidator.isProvided(dto, 'type') &&
            typeof dto.type === 'number' &&
            Number.isInteger(dto.type) &&
            !Object.values(PetType).includes(dto.type)
        ) {
            errors.push('El campo type no corresponde a un tipo de mascota registrado.');
        }

        return errors;
    }
}

class CreatePetDtoValidator extends CommonPetDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['ownerId', 'name', 'type', 'gender'],
            forbiddenFields: ['privacy']
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

class PatchPetOwnerDtoValidator extends CommonPetDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['ownerId'],
            forbiddenFields: [
                'photoPublicId',
                'name',
                'type',
                'birthDate',
                'gender',
                'weight',
                'favoriteFood',
                'privacy'
            ]
        });
    }
}

module.exports = {
    CommonPetDtoValidator,
    CreatePetDtoValidator,
    UpdatePetDtoValidator,
    PatchPetOwnerDtoValidator
};
