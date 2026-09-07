import CommonViewModelValidator from '../Common/CommonViewModelValidator';

const COMMENT_INPUT_FIELDS = Object.freeze({
    userId: Object.freeze({
        label: 'ID de usuario',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 50
    }),

    subject: Object.freeze({
        label: 'Asunto / Título',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 100
    }),

    message: Object.freeze({
        label: 'Mensaje de la reseña',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 500
    }),

    photoPublicId: Object.freeze({
        label: 'Fotografía adjunta',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 200
    })
});

const CREATE_COMMENT_INPUT_FIELDS = Object.freeze({
    ...COMMENT_INPUT_FIELDS,

    userId: Object.freeze({
        ...COMMENT_INPUT_FIELDS.userId,
        required: true,
        requiredMessage: 'El usuario es requerido.'
    }),

    subject: Object.freeze({
        ...COMMENT_INPUT_FIELDS.subject,
        required: true,
        requiredMessage: 'El asunto es requerido.'
    }),

    message: Object.freeze({
        ...COMMENT_INPUT_FIELDS.message,
        required: true,
        requiredMessage: 'El mensaje del comentario es requerido.'
    })
});

class CreateCommentViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            CREATE_COMMENT_INPUT_FIELDS
        );
    }
}

class UpdateCommentViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            COMMENT_INPUT_FIELDS
        );
    }
}

export {
    COMMENT_INPUT_FIELDS,
    CREATE_COMMENT_INPUT_FIELDS,
    CreateCommentViewModelValidator,
    UpdateCommentViewModelValidator
};
