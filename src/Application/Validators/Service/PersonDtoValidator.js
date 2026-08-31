const CommonDtoValidator = require('../Common/CommonDtoValidator');
const DomainSpecificationValidator = require('../Common/DomainSpecificationValidator');
const BirthdaySpecification = require('../../../Domain/Especifications/Common/BirthdaySpecification');

const PERSON_FIELDS = Object.freeze({

    name: {
        type: 'string',
        maxLength: 50
    },

    secondName: {
        type: 'string',
        maxLength: 50,
        allowEmpty: true
    },

    lastName: {
        type: 'string',
        maxLength: 50
    },

    secondLastName: {
        type: 'string',
        maxLength: 50,
        allowEmpty: true
    },

    birthDate: {
        type: 'date',
        nullable: true
    },

    gender: {
        type: 'string',
        maxLength: 20,
        nullable: true
    },

    email: {
        type: 'string',
        maxLength: 254,
        nullable: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'El campo email debe contener un correo electrónico válido.'
    }

});

class CommonPersonDtoValidator {

    validateCommonFields(dto, options = {}) {
        const errors = CommonDtoValidator.validate(dto, PERSON_FIELDS, options);

        if (
            CommonDtoValidator.isProvided(dto, 'birthDate') &&
            dto.birthDate !== null
        ) {
            errors.push(...DomainSpecificationValidator.getErrors([{
                value: dto.birthDate,
                specification: BirthdaySpecification,
                fieldName: 'birthDate',
                message:
                    'El campo birthDate debe usar el formato YYYY-MM-DD y estar entre 1930-01-01 y la fecha actual.'
            }]));
        }

        return errors;
    }
}

class CreatePersonDtoValidator extends CommonPersonDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['name', 'lastName']
        });
    }
}

class UpdatePersonDtoValidator extends CommonPersonDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonPersonDtoValidator,
    CreatePersonDtoValidator,
    UpdatePersonDtoValidator
};
