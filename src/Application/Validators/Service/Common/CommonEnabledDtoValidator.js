const CommonDtoValidator = require('../../Common/CommonDtoValidator');

class CommonEnabledDtoValidator {
    validate(dto) {
        return CommonDtoValidator.validate(dto, {
            enabled: {
                type: 'boolean'
            }
        }, {
            requiredFields: ['enabled']
        });
    }
}

module.exports = CommonEnabledDtoValidator;
