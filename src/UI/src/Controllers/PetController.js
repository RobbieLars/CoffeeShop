import {
    PetListViewModel,
    PetDetailViewModel,
    CreatePetViewModel,
    UpdatePetViewModel,
    PatchPetOwnerViewModel
} from '../ViewModels/Services/PetViewModel';

import {
    CreatePetViewModelValidator,
    UpdatePetViewModelValidator
} from '../Validator/Service/PetViewModelValidator';

import ControllerActionExecutor
    from './Common/ControllerActionExecutor';

class PetController {
    constructor(
        petDataSource,
        controllerActionExecutor = new ControllerActionExecutor()
    ) {
        if (!petDataSource) {
            throw new Error(
                'PetController requiere una fuente de datos.'
            );
        }

        if (!controllerActionExecutor) {
            throw new Error(
                'PetController requiere ControllerActionExecutor.'
            );
        }

        this._petDataSource = petDataSource;
        this._controllerActionExecutor = controllerActionExecutor;

        this._createValidator =
            new CreatePetViewModelValidator();

        this._updateValidator =
            new UpdatePetViewModelValidator();
    }

    // ---------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------
    async GetPagedAsync(paginationData = {}) {
        return this._executeAsync(async () => {
            const dto = await this._petDataSource
                .GetPagedAsync(paginationData);

            return new PetListViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Detail
    // ---------------------------------------------------------------------
    async GetByIdAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._petDataSource
                .GetByIdAsync(id);

            return new PetDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Create
    // ---------------------------------------------------------------------
    async CreateAsync(viewModel = {}) {
        const form = viewModel instanceof CreatePetViewModel
            ? viewModel
            : new CreatePetViewModel(viewModel);

        const validation = this._createValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._petDataSource.CreateAsync(
                this._mapCreateDto(form)
            );

            return new PetDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------
    async UpdateAsync(id, viewModel = {}) {
        const form = viewModel instanceof UpdatePetViewModel
            ? viewModel
            : new UpdatePetViewModel({
                ...viewModel,
                id
            });

        const validation = this._updateValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._petDataSource.UpdateAsync(
                id,
                this._mapUpdateDto(form)
            );

            return new PetDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Patch owner
    // ---------------------------------------------------------------------
    async PatchOwnerAsync(id, viewModel = {}) {
        const form = viewModel instanceof PatchPetOwnerViewModel
            ? viewModel
            : new PatchPetOwnerViewModel({
                ...viewModel,
                id
            });

        return this._executeAsync(async () => {
            const dto = await this._petDataSource.PatchOwnerAsync(
                id,
                { ownerId: form.ownerId }
            );

            return new PetDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Hard delete
    // ---------------------------------------------------------------------
    async HardDeleteAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._petDataSource
                .HardDeleteAsync(id);

            return dto
                ? new PetDetailViewModel(dto)
                : null;
        });
    }

    _executeAsync(action) {
        return this._controllerActionExecutor.ExecuteAsync(action);
    }

    _validationFailure(errors) {
        return {
            successful: false,
            data: null,
            message: 'Revise los campos indicados.',
            errors
        };
    }

    _mapCreateDto(form) {
        return {
            ownerId: form.ownerId,
            photoPublicId: form.photoPublicId ?? null,
            name: form.name.trim(),
            type: this._toOptionalNumber(form.type),
            birthDate: form.birthDate || null,
            gender: this._toOptionalNumber(form.gender),
            weight: this._toNullableNumber(form.weight),
            favoriteFood: this._toNullableText(form.favoriteFood)
        };
    }

    _mapUpdateDto(form) {
        const dto = {};

        this._setIfDefined(dto, 'ownerId', form.ownerId);
        this._setIfDefined(
            dto,
            'photoPublicId',
            form.photoPublicId
        );

        if (
            form.name !== undefined &&
            form.name.trim() !== ''
        ) {
            dto.name = form.name.trim();
        }

        if (form.type !== undefined && form.type !== '') {
            dto.type = Number(form.type);
        }

        if (form.birthDate !== undefined) {
            dto.birthDate = form.birthDate || null;
        }

        if (form.gender !== undefined && form.gender !== '') {
            dto.gender = Number(form.gender);
        }

        if (form.weight !== undefined) {
            dto.weight = this._toNullableNumber(form.weight);
        }

        if (form.favoriteFood !== undefined) {
            dto.favoriteFood = this._toNullableText(
                form.favoriteFood
            );
        }

        this._setIfDefined(dto, 'privacy', form.privacy);

        return dto;
    }

    _setIfDefined(target, fieldName, value) {
        if (value !== undefined) {
            target[fieldName] = value;
        }
    }

    _toOptionalNumber(value) {
        return value === undefined || value === ''
            ? undefined
            : Number(value);
    }

    _toNullableNumber(value) {
        return value === undefined || value === null || value === ''
            ? null
            : Number(value);
    }

    _toNullableText(value) {
        if (value === undefined || value === null) {
            return null;
        }

        const normalizedValue = String(value).trim();

        return normalizedValue || null;
    }
}

export default PetController;
