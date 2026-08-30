const CommonDtoValidator = require('../../Common/CommonDtoValidator');

class CommonVerifiedDtoValidator {
    validate(dto) {
        return CommonDtoValidator.validate(dto, {
            verified: {
                type: 'boolean'
            }
        }, {
            requiredFields: ['verified']
        });
    }
}

module.exports = CommonVerifiedDtoValidator;
