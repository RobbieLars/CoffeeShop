const CommonDtoValidator = require('../Common/CommonDtoValidator');

const ROLE_FIELDS = Object.freeze({

    name: {
        type: 'string',
        maxLength: 50
    },

    description: {
        type: 'string',
        maxLength: 250
    },

    enabled: {
        type: 'boolean'
    }

});

class CommonRoleDtoValidator {

    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, ROLE_FIELDS, options);
    }
}

class CreateRoleDtoValidator extends CommonRoleDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['name', 'description'],
            forbiddenFields: ['enabled']
        });
    }
}

class UpdateRoleDtoValidator extends CommonRoleDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonRoleDtoValidator,
    CreateRoleDtoValidator,
    UpdateRoleDtoValidator
};