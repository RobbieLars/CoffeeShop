import CommonViewModelValidator from '../Common/CommonViewModelValidator';

const PURCHASE_INPUT_FIELDS = Object.freeze({
    productId: Object.freeze({
        label: 'Producto',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 50
    }),

    userId: Object.freeze({
        label: 'Usuario comprador',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 50
    }),

    petId: Object.freeze({
        label: 'Mascota asociada',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 50
    }),

    day: Object.freeze({
        label: 'Fecha de compra',
        type: 'date',
        required: false,
        requiredMessage: null
    }),

    photoPublicId: Object.freeze({
        label: 'Comprobante / Fotografía',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 200
    })
});

const CREATE_PURCHASE_INPUT_FIELDS = Object.freeze({
    ...PURCHASE_INPUT_FIELDS,

    productId: Object.freeze({
        ...PURCHASE_INPUT_FIELDS.productId,
        required: true,
        requiredMessage: 'Debe seleccionar un producto.'
    }),

    userId: Object.freeze({
        ...PURCHASE_INPUT_FIELDS.userId,
        required: true,
        requiredMessage: 'Debe especificar el usuario comprador.'
    })
});

class CreatePurchaseViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            CREATE_PURCHASE_INPUT_FIELDS
        );
    }
}

class UpdatePurchaseViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            PURCHASE_INPUT_FIELDS
        );
    }
}

export {
    PURCHASE_INPUT_FIELDS,
    CREATE_PURCHASE_INPUT_FIELDS,
    CreatePurchaseViewModelValidator,
    UpdatePurchaseViewModelValidator
};
