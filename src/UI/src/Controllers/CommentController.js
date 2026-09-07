import {
    CommentListViewModel,
    CommentDetailViewModel,
    CreateCommentViewModel,
    UpdateCommentViewModel,
    PatchCommentMessageViewModel
} from '../ViewModels/Services/CommentViewModel';

import {
    CreateCommentViewModelValidator,
    UpdateCommentViewModelValidator
} from '../Validator/Service/CommentViewModelValidator';

import ControllerActionExecutor
    from './Common/ControllerActionExecutor';

class CommentController {
    constructor(
        commentDataSource,
        controllerActionExecutor = new ControllerActionExecutor()
    ) {
        if (!commentDataSource) {
            throw new Error(
                'CommentController requiere una fuente de datos.'
            );
        }

        if (!controllerActionExecutor) {
            throw new Error(
                'CommentController requiere ControllerActionExecutor.'
            );
        }

        this._commentDataSource = commentDataSource;
        this._controllerActionExecutor = controllerActionExecutor;

        this._createValidator =
            new CreateCommentViewModelValidator();

        this._updateValidator =
            new UpdateCommentViewModelValidator();
    }

    // ---------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------
    async GetPagedAsync(paginationData = {}) {
        return this._executeAsync(async () => {
            const dto = await this._commentDataSource
                .GetPagedAsync(paginationData);

            return new CommentListViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Detail
    // ---------------------------------------------------------------------
    async GetByIdAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._commentDataSource
                .GetByIdAsync(id);

            return new CommentDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Create
    // ---------------------------------------------------------------------
    async CreateAsync(viewModel = {}) {
        const form = viewModel instanceof CreateCommentViewModel
            ? viewModel
            : new CreateCommentViewModel(viewModel);

        const validation = this._createValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._commentDataSource.CreateAsync(
                this._mapCreateDto(form)
            );

            return new CommentDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------------
    async UpdateAsync(id, viewModel = {}) {
        const form = viewModel instanceof UpdateCommentViewModel
            ? viewModel
            : new UpdateCommentViewModel({
                ...viewModel,
                id
            });

        const validation = this._updateValidator.validate(form);

        if (!validation.isValid) {
            return this._validationFailure(validation.errors);
        }

        return this._executeAsync(async () => {
            const dto = await this._commentDataSource.UpdateAsync(
                id,
                this._mapUpdateDto(form)
            );

            return new CommentDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Patch message
    // ---------------------------------------------------------------------
    async PatchMessageAsync(id, viewModel = {}) {
        const form = viewModel instanceof PatchCommentMessageViewModel
            ? viewModel
            : new PatchCommentMessageViewModel({
                ...viewModel,
                id
            });

        return this._executeAsync(async () => {
            const dto = await this._commentDataSource.PatchMessageAsync(
                id,
                {
                    subject: form.subject?.trim() || undefined,
                    message: form.message.trim()
                }
            );

            return new CommentDetailViewModel(dto);
        });
    }

    // ---------------------------------------------------------------------
    // Hard delete
    // ---------------------------------------------------------------------
    async HardDeleteAsync(id) {
        return this._executeAsync(async () => {
            const dto = await this._commentDataSource
                .HardDeleteAsync(id);

            return dto
                ? new CommentDetailViewModel(dto)
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
            userId: form.userId.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            photoPublicId: this._toNullableText(form.photoPublicId)
        };
    }

    _mapUpdateDto(form) {
        const dto = {};

        if (form.userId !== undefined && form.userId.trim() !== '') {
            dto.userId = form.userId.trim();
        }

        if (form.subject !== undefined && form.subject.trim() !== '') {
            dto.subject = form.subject.trim();
        }

        if (form.message !== undefined && form.message.trim() !== '') {
            dto.message = form.message.trim();
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

export default CommentController;
