import {
    useMemo
} from 'react';

import {
    ActionMenu,
    ComboBox,
    DataTable,
    FilterPanel,
    Modal,
    PageContainer
} from '@common-ui';

import ViewModelFieldHelper
    from '../../Helpers/ViewModelFieldHelper';

import {
    CommentDetailViewModel,
    CommentFilterViewModel,
    CommentListItemViewModel
} from '../../ViewModels/Services/CommentViewModel';

import { useCommentsView } from '../../wwwroot/js/HookViews/useCommentsView';
import '../../wwwroot/css/Views/CommentsView.css';

const DEFAULT_USER_OPTIONS = Object.freeze([
    Object.freeze({ value: '000000000000000000000101', label: 'ana.martinez', code: '000000000000000000000101', name: 'ana.martinez' }),
    Object.freeze({ value: '000000000000000000000102', label: 'carlos.lopez', code: '000000000000000000000102', name: 'carlos.lopez' }),
    Object.freeze({ value: '000000000000000000000103', label: 'maria.garcia', code: '000000000000000000000103', name: 'maria.garcia' }),
    Object.freeze({ value: '000000000000000000000104', label: 'jose.ramirez', code: '000000000000000000000104', name: 'jose.ramirez' }),
    Object.freeze({ value: '000000000000000000000105', label: 'sofia.hernandez', code: '000000000000000000000105', name: 'sofia.hernandez' })
]);

function mergeOptions(primaryOptions, fallbackOptions) {
    const optionsByValue = new Map();

    for (const option of [
        ...(primaryOptions ?? []),
        ...(fallbackOptions ?? [])
    ]) {
        if (option?.value !== undefined) {
            optionsByValue.set(option.value, option);
        }
    }

    return [...optionsByValue.values()];
}

function formatDisplayValue(value) {
    return value === undefined || value === null || value === ''
        ? '—'
        : String(value);
}

function CommentActionsMenu({
    comment,
    onDetail,
    onEdit,
    onDelete
}) {
    return (
        <ActionMenu
            ariaLabel={`Acciones para comentario: ${comment.subject}`}
            className="comment-view__action-menu"
            triggerClassName="comment-view__action-trigger"
            menuClassName="comment-view__action-list"
            itemClassName="comment-view__action-item"
            items={[
                {
                    id: 'edit',
                    label: 'Editar',
                    onClick: onEdit
                },
                {
                    id: 'detail',
                    label: 'Detalles',
                    onClick: onDetail
                },
                {
                    id: 'delete',
                    label: 'Eliminar',
                    danger: true,
                    onClick: onDelete
                }
            ]}
        />
    );
}

function CommentsView({
    controller,
    userOptions = []
}) {
    const view = useCommentsView(controller);

    const resolvedUserOptions = useMemo(() =>
        mergeOptions(
            userOptions.length > 0 ? userOptions : DEFAULT_USER_OPTIONS,
            view.listViewModel.items
                .filter((item) => item.userId)
                .map((item) => ({
                    value: item.userId,
                    label: item.userUsername || item.userId,
                    code: item.userId,
                    name: item.userUsername || ''
                }))
        ),
    [userOptions, view.listViewModel.items]);

    const columns = [
        {
            id: 'userUsername',
            header: CommentListItemViewModel.labels.userUsername,
            accessor: 'userUsername'
        },
        {
            id: 'subject',
            header: CommentListItemViewModel.labels.subject,
            accessor: 'subject'
        },
        {
            id: 'message',
            header: CommentListItemViewModel.labels.message,
            accessor: 'message'
        },
        {
            id: 'edited',
            header: CommentListItemViewModel.labels.edited,
            accessor: 'editedLabel',
            render: (_, comment) => (
                <span>{comment.editedLabel}</span>
            )
        },
        {
            id: 'actions',
            header: CommentListItemViewModel.labels.actions,
            searchable: false,
            render: (_, comment) => (
                <div className="comment-view__row-actions">
                    <CommentActionsMenu
                        comment={comment}
                        onEdit={() =>
                            view.openUpdateModal(comment.id)
                        }
                        onDetail={() =>
                            view.openDetailModal(comment.id)
                        }
                        onDelete={() =>
                            view.deleteComment(comment)
                        }
                    />
                </div>
            )
        }
    ];

    const modalTitle = {
        [view.MODAL_MODES.CREATE]: 'Crear comentario',
        [view.MODAL_MODES.DETAIL]: 'Detalle de comentario',
        [view.MODAL_MODES.UPDATE]: 'Actualizar comentario'
    }[view.modalMode];

    const formId = `comment-${view.modalMode ?? 'form'}`;

    const modalFooter = view.modalMode === view.MODAL_MODES.DETAIL
        ? (
            <button
                type="button"
                className="comment-view__button ui-button"
                onClick={view.closeModal}
            >
                Cerrar
            </button>
        )
        : (
            <>
                <button
                    type="button"
                    className="comment-view__button ui-button"
                    disabled={view.submitting}
                    onClick={view.closeModal}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    form={formId}
                    className="comment-view__button ui-button ui-button--primary"
                    disabled={
                        view.submitting ||
                        view.modalLoading ||
                        !view.formViewModel
                    }
                >
                    {view.submitting ? 'Guardando...' : 'Guardar'}
                </button>
            </>
        );

    return (
        <PageContainer
            title="Comentarios y Reseñas"
            description="Opiniones, experiencias y sugerencias compartidas por la comunidad de clientes."
            className="comment-view"
            actions={(
                <button
                    type="button"
                    className="comment-view__button ui-button ui-button--primary"
                    onClick={view.openCreateModal}
                >
                    Crear comentario
                </button>
            )}
        >
            <FilterPanel
                onClear={view.clearFilters}
                onSubmit={view.applyFilters}
                clearLabel="Limpiar"
                filterLabel="Filtrar"
            >
                <FilterInput
                    fieldName="userUsername"
                    value={view.filters.userUsername}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="subject"
                    value={view.filters.subject}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="message"
                    value={view.filters.message}
                    onChange={view.setFilter}
                />
            </FilterPanel>

            {view.error && (
                <div
                    className="comment-view__message ui-message--error"
                    role="alert"
                >
                    {view.error}
                    <button
                        type="button"
                        className="comment-view__button ui-button"
                        onClick={view.reload}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {view.notification && (
                <div
                    className="comment-view__message ui-notification"
                    role="status"
                >
                    <span>{view.notification}</span>

                    <button
                        type="button"
                        className="comment-view__button ui-button"
                        onClick={view.dismissNotification}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            <DataTable
                columns={columns}
                rows={view.listViewModel.items}
                loading={view.loading}
                searchable={false}
                initialPageSize={view.pageSize}
                pageSizeOptions={[5, 10, 25]}
                emptyMessage="No hay comentarios para mostrar."
                externalPagination={{
                    page: view.listViewModel.page,
                    pageSize: view.listViewModel.pageSize,
                    totalItems: view.listViewModel.totalItems,
                    totalPages: view.listViewModel.totalPages,
                    onPageChange: view.setPage,
                    onPageSizeChange: view.changePageSize
                }}
            />

            <Modal
                open={Boolean(view.modalMode)}
                title={modalTitle}
                footer={modalFooter}
                onClose={view.closeModal}
            >
                {view.modalLoading && (
                    <div className="comment-view__message">
                        Cargando información...
                    </div>
                )}

                {view.modalError && (
                    <div
                        className="comment-view__message ui-message--error"
                        role="alert"
                    >
                        {view.modalError}
                    </div>
                )}

                {!view.modalLoading &&
                    view.modalMode === view.MODAL_MODES.DETAIL &&
                    view.detailViewModel && (
                        <CommentDetail
                            viewModel={view.detailViewModel}
                        />
                    )}

                {!view.modalLoading &&
                    view.modalMode !== view.MODAL_MODES.DETAIL &&
                    view.formViewModel && (
                        <CommentForm
                            id={formId}
                            viewModel={view.formViewModel}
                            userOptions={resolvedUserOptions}
                            errors={view.formErrors}
                            onFieldChange={view.setFormField}
                            onSubmit={view.submitForm}
                        />
                    )}
            </Modal>
        </PageContainer>
    );
}

function FilterInput({ fieldName, value, onChange }) {
    const rules = CommentFilterViewModel.fields[fieldName];

    return (
        <label className="comment-view__field">
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                className="comment-view__input ui-input"
                value={value}
                onChange={(event) =>
                    onChange(
                        fieldName,
                        ViewModelFieldHelper.sanitizeValue(
                            event.target.value,
                            rules
                        )
                    )
                }
            />
        </label>
    );
}

function CommentForm({
    id,
    viewModel,
    userOptions,
    errors,
    onFieldChange,
    onSubmit
}) {
    const labels = viewModel.constructor.labels;

    return (
        <form
            id={id}
            className="comment-form"
            noValidate
            onSubmit={onSubmit}
        >
            <ComboBox
                label={labels.userId}
                value={viewModel.userId}
                options={userOptions}
                searchable
                searchTypes={[
                    {
                        id: 'code',
                        label: 'Código',
                        accessor: 'code'
                    },
                    {
                        id: 'name',
                        label: 'Usuario',
                        accessor: 'name'
                    }
                ]}
                onChange={(option) =>
                    onFieldChange('userId', option?.value ?? '')
                }
            />

            <CommentFormInput
                fieldName="subject"
                viewModel={viewModel}
                error={errors?.subject}
                onChange={onFieldChange}
            />

            <CommentFormInput
                fieldName="photoPublicId"
                viewModel={viewModel}
                error={errors?.photoPublicId}
                onChange={onFieldChange}
            />

            <div className="comment-view__field comment-form__full">
                <label className="comment-view__field" htmlFor={`${id}-message`}>
                    <span>{labels.message}</span>
                    <textarea
                        id={`${id}-message`}
                        className="comment-view__input ui-input"
                        style={{ minHeight: '4.5rem', resize: 'vertical' }}
                        value={viewModel.message ?? ''}
                        onChange={(event) =>
                            onFieldChange(
                                'message',
                                ViewModelFieldHelper.sanitizeValue(
                                    event.target.value,
                                    viewModel.constructor.fields.message
                                )
                            )
                        }
                    />
                    {errors?.message && (
                        <span className="comment-view__field-error ui-message--error">
                            {errors.message}
                        </span>
                    )}
                </label>
            </div>
        </form>
    );
}

function CommentFormInput({
    fieldName,
    viewModel,
    error,
    onChange
}) {
    const rules = viewModel.constructor.fields[fieldName];
    if (!rules) return null;
    const inputId = `comment-form-${fieldName}`;
    const errorId = `${inputId}-error`;

    return (
        <label className="comment-view__field" htmlFor={inputId}>
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                id={inputId}
                className="comment-view__input ui-input"
                value={viewModel[fieldName] ?? ''}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) =>
                    onChange(
                        fieldName,
                        ViewModelFieldHelper.sanitizeValue(
                            event.target.value,
                            rules
                        )
                    )
                }
            />

            {error && (
                <span
                    id={errorId}
                    className="comment-view__field-error ui-message--error"
                >
                    {error}
                </span>
            )}
        </label>
    );
}

function CommentDetail({ viewModel }) {
    const labels = CommentDetailViewModel.labels;

    const fields = [
        ['userUsername', viewModel.userUsername],
        ['subject', viewModel.subject],
        ['message', viewModel.message],
        ['edited', viewModel.editedLabel],
        ['photoPublicId', viewModel.photoPublicId],
        ['createdDateAt', viewModel.createdDateAt],
        ['createdTimeAt', viewModel.createdTimeAt],
        ['updatedDateAt', viewModel.updatedDateAt],
        ['updatedTimeAt', viewModel.updatedTimeAt]
    ];

    return (
        <dl className="comment-detail">
            {fields.map(([fieldName, value]) => (
                <div
                    key={fieldName}
                    className={`comment-detail__field ${
                        fieldName === 'message' ? 'comment-form__full' : ''
                    }`}
                >
                    <dt>{labels[fieldName]}</dt>
                    <dd>{formatDisplayValue(value)}</dd>
                </div>
            ))}
        </dl>
    );
}

export default CommentsView;
