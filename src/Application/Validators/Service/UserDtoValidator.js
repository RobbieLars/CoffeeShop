const CommonDtoValidator = require('../Common/CommonDtoValidator');

const USER_FIELDS = Object.freeze({

    photoProfilePublicId: {
        type: 'string',
        maxLength: 255,
        allowEmpty: true
    },

    username: {
        type: 'string',
        maxLength: 30
    },

    password: {
        type: 'string',
        minLength: 8,
        maxLength: 128
    },

    verified: {
        type: 'boolean'
    },

    lockedUntil: {
        type: 'date',
        nullable: true
    },

    failedLoginAttempts: {
        type: 'number',
        integer: true,
        min: 0,
        minMessage: 'El campo failedLoginAttempts no puede ser menor que 0.'
    },

    personId: {
        type: 'objectId'
    },

    enabled: {
        type: 'boolean'
    }

});

class CommonUserDtoValidator {

    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, USER_FIELDS, options);
    }
}

class CreateUserDtoValidator extends CommonUserDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: [
                'username',
                'password',
                'personId'
            ],
            forbiddenFields: [
                'verified',
                'lockedUntil',
                'failedLoginAttempts',
                'enabled'
            ]
        });
    }
}

class UpdateUserDtoValidator extends CommonUserDtoValidator {

    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true
        });
    }
}

module.exports = {
    CommonUserDtoValidator,
    CreateUserDtoValidator,
    UpdateUserDtoValidator
};
