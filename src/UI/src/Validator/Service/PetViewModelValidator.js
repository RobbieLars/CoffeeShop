import CommonViewModelValidator from '../Common/CommonViewModelValidator';

const PET_INPUT_FIELDS = Object.freeze({
    name: Object.freeze({
        label: 'Nombre',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 50
    }),

    birthDate: Object.freeze({
        label: 'Fecha de nacimiento',
        type: 'date',
        required: false,
        requiredMessage: null
    }),

    weight: Object.freeze({
        label: 'Peso',
        type: 'number',
        required: false,
        requiredMessage: null,
        min: 0
    }),

    favoriteFood: Object.freeze({
        label: 'Comida favorita',
        type: 'string',
        required: false,
        requiredMessage: null,
        maxLength: 100
    })
});

const CREATE_PET_INPUT_FIELDS = Object.freeze({
    ...PET_INPUT_FIELDS,

    name: Object.freeze({
        ...PET_INPUT_FIELDS.name,
        required: true,
        requiredMessage: 'El nombre es requerido.'
    })
});

class CreatePetViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            CREATE_PET_INPUT_FIELDS
        );
    }
}

class UpdatePetViewModelValidator {
    validate(viewModel) {
        return CommonViewModelValidator.validate(
            viewModel,
            PET_INPUT_FIELDS
        );
    }
}

export {
    PET_INPUT_FIELDS,
    CREATE_PET_INPUT_FIELDS,
    CreatePetViewModelValidator,
    UpdatePetViewModelValidator
};