import {
    PurchaseListViewModel,
    PurchaseDetailViewModel,
    CreatePurchaseViewModel,
    UpdatePurchaseViewModel
} from '../ViewModels/Services/PurchaseViewModel';

import {
    CreatePurchaseViewModelValidator,
    UpdatePurchaseViewModelValidator
} from '../Validator/Service/PurchaseViewModelValidator';

import ControllerActionExecutor
    from './Common/ControllerActionExecutor';

class PurchaseController {
    constructor(
        purchaseDataSource,
        controllerActionExecutor = new ControllerActionExecutor()
    ) {
        if (!purchaseDataSource) {
            throw new Error(
                'PurchaseController requiere una fuente de datos.'
            );
        }

        if (!controllerActionExecutor) {
            throw new Error(
                'PurchaseController requiere ControllerActionExecutor.'
            );
        }

        this._purchaseDataSource = purchaseDataSource;
        this._controllerActionExecutor = controllerActionExecutor;

        this._createValidator =
            new CreatePurchaseViewModelValidator();

        this._updateValidator =
            new UpdatePurchaseViewModelValidator();
    }

    // ---------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------
    async GetPagedAsync(paginationData = {}) {
        return this._executeAsync(async () => {
            const dto = await this._purchaseDataSource
                .GetPagedAsync(paginationData);

            return new PurchaseListViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Detail
    // ---------------------------------------------------------------------
    async GetByIdAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._purchaseDataSource
                .GetByIdAsync(id);

            return new PurchaseDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Create
    // ---------------------------------------------------------------------
    async CreateAsync(viewModel = {}) {
        const form = viewModel instanceof CreatePurchaseViewModel
            ? viewModel
            : new CreatePurchaseViewModel(viewModel);

        const validation = this._createValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._purchaseDataSource.CreateAsync(
                this._mapCreateDto(form)
            );

            return new PurchaseDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------
    async UpdateAsync(id, viewModel = {}) {
        const form = viewModel instanceof UpdatePurchaseViewModel
            ? viewModel
            : new UpdatePurchaseViewModel({
                ...viewModel,
                id
            });

        const validation = this._updateValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._purchaseDataSource.UpdateAsync(
                id,
                this._mapUpdateDto(form)
            );

            return new PurchaseDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Hard delete
    // ---------------------------------------------------------------------
    async HardDeleteAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._purchaseDataSource
                .HardDeleteAsync(id);

            return dto
                ? new PurchaseDetailViewModel(dto)
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
            productId: form.productId.trim(),
            userId: form.userId.trim(),
            petId: this._toNullableText(form.petId)
        };
    }

    _mapUpdateDto(form) {
        const dto = {};

        if (form.productId !== undefined && form.productId.trim() !== '') {
            dto.productId = form.productId.trim();
        }

        if (form.userId !== undefined && form.userId.trim() !== '') {
            dto.userId = form.userId.trim();
        }

        if (form.petId !== undefined) {
            dto.petId = this._toNullableText(form.petId);
        }

        if (form.day !== undefined) {
            dto.day = form.day || null;
        }

        if (form.photoPublicId !== undefined) {
            dto.photoPublicId = this._toNullableText(form.photoPublicId);
        }

        return dto;
    }

    _toNullableText(value) {
        if (value === undefined || value === null) {
            return null;
        }

        const normalizedValue = String(value).trim();

        return normalizedValue || null;
    }
}

export default PurchaseController;
