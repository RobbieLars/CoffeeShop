import CommonViewModelValidator from '../Common/CommonViewModelValidator';

const PRODUCT_INPUT_FIELDS = Object.freeze({
    name: Object.freeze({
        label: 'Nombre del producto',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 100
    }),

    description: Object.freeze({
        label: 'Descripción',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 500
    }),

    imgPublicId: Object.freeze({
        label: 'Imagen',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 200
    }),

    price: Object.freeze({
        label: 'Precio',
        type: 'number',
        required: false,
        requiredMessage: null,
        min: 0
    }),

    url: Object.freeze({
        label: 'URL amigable',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 200
    })
});

const CREATE_PRODUCT_INPUT_FIELDS = Object.freeze({
    ...PRODUCT_INPUT_FIELDS,

    name: Object.freeze({
        ...PRODUCT_INPUT_FIELDS.name,
        required: true,
        requiredMessage: 'El nombre del producto es requerido.'
    }),

    price: Object.freeze({
        ...PRODUCT_INPUT_FIELDS.price,
        required: true,
        requiredMessage: 'El precio es requerido.'
    })
});

class CreateProductViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            CREATE_PRODUCT_INPUT_FIELDS
        );
    }
}

class UpdateProductViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            PRODUCT_INPUT_FIELDS
        );
    }
}

export {
    PRODUCT_INPUT_FIELDS,
    CREATE_PRODUCT_INPUT_FIELDS,
    CreateProductViewModelValidator,
    UpdateProductViewModelValidator
};
