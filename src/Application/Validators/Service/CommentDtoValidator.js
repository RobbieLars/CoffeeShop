const CommonDtoValidator = require('../Common/CommonDtoValidator');

const COMMENT_FIELDS = Object.freeze({
    userId: {
        type: 'objectId'
    },
    message: {
        type: 'string',
        maxLength: 500
    },
    photoPublicId: {
        type: 'string',
        maxLength: 255,
        nullable: true
    },
    edited: {
        type: 'boolean'
    }
});

class CommonCommentDtoValidator {
    validateCommonFields(dto, options = {}) {
        return CommonDtoValidator.validate(dto, COMMENT_FIELDS, options);
    }
}

class CreateCommentDtoValidator extends CommonCommentDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: [
                'userId',
                'message'
            ],
            forbiddenFields: [
                'edited'
            ]
        });
    }
}

class UpdateCommentDtoValidator extends CommonCommentDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requireAtLeastOne: true,
            forbiddenFields: [
                'edited'
            ]
        });
    }
}

class PatchCommentMessageDtoValidator extends CommonCommentDtoValidator {
    validate(dto) {
        return this.validateCommonFields(dto, {
            requiredFields: ['message'],
            forbiddenFields: [
                'userId',
                'photoPublicId',
                'edited'
            ]
        });
    }
}

module.exports = {
    CommonCommentDtoValidator,
    CreateCommentDtoValidator,
    UpdateCommentDtoValidator,
    PatchCommentMessageDtoValidator
};
