import {
    ProductListViewModel,
    ProductDetailViewModel,
    CreateProductViewModel,
    UpdateProductViewModel
} from '../ViewModels/Services/ProductViewModel';

import {
    CreateProductViewModelValidator,
    UpdateProductViewModelValidator
} from '../Validator/Service/ProductViewModelValidator';

import ControllerActionExecutor
    from './Common/ControllerActionExecutor';

class ProductController {
    constructor(
        productDataSource,
        controllerActionExecutor = new ControllerActionExecutor()
    ) {
        if (!productDataSource) {
            throw new Error(
                'ProductController requiere una fuente de datos.'
            );
        }

        if (!controllerActionExecutor) {
            throw new Error(
                'ProductController requiere ControllerActionExecutor.'
            );
        }

        this._productDataSource = productDataSource;
        this._controllerActionExecutor = controllerActionExecutor;

        this._createValidator =
            new CreateProductViewModelValidator();

        this._updateValidator =
            new UpdateProductViewModelValidator();
    }

    // ---------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------
    async GetPagedAsync(paginationData = {}) {
        return this._executeAsync(async () => {
            const dto = await this._productDataSource
                .GetPagedAsync(paginationData);

            return new ProductListViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Detail
    // ---------------------------------------------------------------------
    async GetByIdAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._productDataSource
                .GetByIdAsync(id);

            return new ProductDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Create
    // ---------------------------------------------------------------------
    async CreateAsync(viewModel = {}) {
        const form = viewModel instanceof CreateProductViewModel
            ? viewModel
            : new CreateProductViewModel(viewModel);

        const validation = this._createValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._productDataSource.CreateAsync(
                this._mapCreateDto(form)
            );

            return new ProductDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------
    async UpdateAsync(id, viewModel = {}) {
        const form = viewModel instanceof UpdateProductViewModel
            ? viewModel
            : new UpdateProductViewModel({
                ...viewModel,
                id
            });

        const validation = this._updateValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._productDataSource.UpdateAsync(
                id,
                this._mapUpdateDto(form)
            );

            return new ProductDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Patch enabled
    // ---------------------------------------------------------------------
    async PatchEnabledAsync(id, enabled) {
        return this._executeAsync(async () => {
            const dto = await this._productDataSource.PatchEnabledAsync(
                id,
                { enabled: Boolean(enabled) }
            );

            return new ProductDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Soft delete
    // ---------------------------------------------------------------------
    async SoftDeleteAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._productDataSource
                .SoftDeleteAsync(id);

            return dto
                ? new ProductDetailViewModel(dto)
                : null;
        });
    }

    // ---------------------------------------------------------------------
    // Hard delete
    // ---------------------------------------------------------------------
    async HardDeleteAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._productDataSource
                .HardDeleteAsync(id);

            return dto
                ? new ProductDetailViewModel(dto)
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
            name: form.name.trim(),
            description: this._toNullableText(form.description),
            imgPublicId: this._toNullableText(form.imgPublicId),
            price: Number(form.price),
            url: this._toNullableText(form.url)
        };
    }

    _mapUpdateDto(form) {
        const dto = {};

        if (form.name !== undefined && form.name.trim() !== '') {
            dto.name = form.name.trim();
        }

        if (form.description !== undefined) {
            dto.description = this._toNullableText(form.description);
        }

        if (form.imgPublicId !== undefined) {
            dto.imgPublicId = this._toNullableText(form.imgPublicId);
        }

        if (form.price !== undefined && form.price !== '') {
            dto.price = Number(form.price);
        }

        if (form.url !== undefined) {
            dto.url = this._toNullableText(form.url);
        }

        if (form.enabled !== undefined) {
            dto.enabled = Boolean(form.enabled);
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

export default ProductController;
