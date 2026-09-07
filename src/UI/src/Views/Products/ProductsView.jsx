import {
    useMemo
} from 'react';

import {
    ActionMenu,
    ComboBox,
    DataTable,
    FilterPanel,
    Modal,
    PageContainer,
    ToggleSwitch
} from '@common-ui';

import ViewModelFieldHelper
    from '../../Helpers/ViewModelFieldHelper';

import {
    ProductDetailViewModel,
    ProductFilterViewModel,
    ProductListItemViewModel
} from '../../ViewModels/Services/ProductViewModel';

import { useProductsView } from '../../wwwroot/js/HookViews/useProductsView';
import '../../wwwroot/css/Views/ProductsView.css';

const STATUS_OPTIONS = Object.freeze([
    Object.freeze({ value: '', label: 'Todos los estados' }),
    Object.freeze({ value: 'true', label: 'Activo' }),
    Object.freeze({ value: 'false', label: 'Inactivo' })
]);

function formatDisplayValue(value) {
    return value === undefined || value === null || value === ''
        ? '—'
        : String(value);
}

function ProductActionsMenu({
    product,
    onDetail,
    onEdit,
    onDelete
}) {
    return (
        <ActionMenu
            ariaLabel={`Acciones para ${product.name}`}
            className="product-view__action-menu"
            triggerClassName="product-view__action-trigger"
            menuClassName="product-view__action-list"
            itemClassName="product-view__action-item"
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

function ProductsView({ controller }) {
    const view = useProductsView(controller);

    const columns = [
        {
            id: 'name',
            header: ProductListItemViewModel.labels.name,
            accessor: 'name'
        },
        {
            id: 'price',
            header: ProductListItemViewModel.labels.price,
            accessor: 'formattedPrice'
        },
        {
            id: 'enabled',
            header: ProductListItemViewModel.labels.enabled,
            accessor: 'enabledName',
            render: (_, product) => (
                <span
                    className={`product-status-badge ${
                        product.enabled
                            ? 'product-status-badge--active'
                            : 'product-status-badge--inactive'
                    }`}
                >
                    {product.enabledName}
                </span>
            )
        },
        {
            id: 'actions',
            header: ProductListItemViewModel.labels.actions,
            searchable: false,
            render: (_, product) => (
                <div className="product-view__row-actions">
                    <ProductActionsMenu
                        product={product}
                        onEdit={() =>
                            view.openUpdateModal(product.id)
                        }
                        onDetail={() =>
                            view.openDetailModal(product.id)
                        }
                        onDelete={() =>
                            view.deleteProduct(product)
                        }
                    />
                </div>
            )
        }
    ];

    const modalTitle = {
        [view.MODAL_MODES.CREATE]: 'Crear producto',
        [view.MODAL_MODES.DETAIL]: 'Detalle de producto',
        [view.MODAL_MODES.UPDATE]: 'Actualizar producto'
    }[view.modalMode];

    const formId = `product-${view.modalMode ?? 'form'}`;

    const modalFooter = view.modalMode === view.MODAL_MODES.DETAIL
        ? (
            <button
                type="button"
                className="product-view__button ui-button"
                onClick={view.closeModal}
            >
                Cerrar
            </button>
        )
        : (
            <>
                <button
                    type="button"
                    className="product-view__button ui-button"
                    disabled={view.submitting}
                    onClick={view.closeModal}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    form={formId}
                    className="product-view__button ui-button ui-button--primary"
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
            title="Productos"
            description="Consulta y administra el catálogo de productos disponibles."
            className="product-view"
            actions={(
                <button
                    type="button"
                    className="product-view__button ui-button ui-button--primary"
                    onClick={view.openCreateModal}
                >
                    Crear producto
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
                    fieldName="name"
                    value={view.filters.name}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="minPrice"
                    value={view.filters.minPrice}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="maxPrice"
                    value={view.filters.maxPrice}
                    onChange={view.setFilter}
                />

                <FilterComboBox
                    label={ProductFilterViewModel.labels.enabled}
                    value={view.filters.enabled}
                    options={STATUS_OPTIONS}
                    onChange={(value) =>
                        view.setFilter('enabled', value)
                    }
                />
            </FilterPanel>

            {view.error && (
                <div
                    className="product-view__message ui-message--error"
                    role="alert"
                >
                    {view.error}
                    <button
                        type="button"
                        className="product-view__button ui-button"
                        onClick={view.reload}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {view.notification && (
                <div
                    className="product-view__message ui-notification"
                    role="status"
                >
                    <span>{view.notification}</span>

                    <button
                        type="button"
                        className="product-view__button ui-button"
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
                emptyMessage="No hay productos para mostrar."
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
                    <div className="product-view__message">
                        Cargando información...
                    </div>
                )}

                {view.modalError && (
                    <div
                        className="product-view__message ui-message--error"
                        role="alert"
                    >
                        {view.modalError}
                    </div>
                )}

                {!view.modalLoading &&
                    view.modalMode === view.MODAL_MODES.DETAIL &&
                    view.detailViewModel && (
                        <ProductDetail
                            viewModel={view.detailViewModel}
                        />
                    )}

                {!view.modalLoading &&
                    view.modalMode !== view.MODAL_MODES.DETAIL &&
                    view.formViewModel && (
                        <ProductForm
                            id={formId}
                            viewModel={view.formViewModel}
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
    const rules = ProductFilterViewModel.fields[fieldName];

    return (
        <label className="product-view__field">
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                className="product-view__input ui-input"
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

function FilterComboBox({
    label,
    value,
    options,
    onChange
}) {
    return (
        <ComboBox
            label={label}
            value={value}
            options={options}
            searchable={false}
            clearable={false}
            onChange={(option) =>
                onChange(option ? (option.value ?? null) : null)
            }
        />
    );
}

function ProductForm({
    id,
    viewModel,
    errors,
    onFieldChange,
    onSubmit
}) {
    const labels = viewModel.constructor.labels;

    return (
        <form
            id={id}
            className="product-form"
            noValidate
            onSubmit={onSubmit}
        >
            <ProductFormInput
                fieldName="name"
                viewModel={viewModel}
                error={errors?.name}
                onChange={onFieldChange}
            />

            <ProductFormInput
                fieldName="price"
                viewModel={viewModel}
                error={errors?.price}
                onChange={onFieldChange}
            />

            <ProductFormInput
                fieldName="url"
                viewModel={viewModel}
                error={errors?.url}
                onChange={onFieldChange}
            />

            <ProductFormInput
                fieldName="imgPublicId"
                viewModel={viewModel}
                error={errors?.imgPublicId}
                onChange={onFieldChange}
            />

            <div className="product-view__field product-form__full">
                <label className="product-view__field" htmlFor={`${id}-description`}>
                    <span>{labels.description}</span>
                    <textarea
                        id={`${id}-description`}
                        className="product-view__input ui-input"
                        style={{ minHeight: '4.5rem', resize: 'vertical' }}
                        value={viewModel.description ?? ''}
                        onChange={(event) =>
                            onFieldChange(
                                'description',
                                ViewModelFieldHelper.sanitizeValue(
                                    event.target.value,
                                    viewModel.constructor.fields.description
                                )
                            )
                        }
                    />
                    {errors?.description && (
                        <span className="product-view__field-error ui-message--error">
                            {errors.description}
                        </span>
                    )}
                </label>
            </div>

            {'enabled' in viewModel && (
                <div className="product-form__field product-form__full">
                    <ToggleSwitch
                        id="product-form-enabled"
                        label={labels.enabled}
                        checked={Boolean(viewModel.enabled)}
                        onChange={(checked) =>
                            onFieldChange('enabled', checked)
                        }
                        yesLabel="SI"
                        noLabel="NO"
                    />
                </div>
            )}
        </form>
    );
}

function ProductFormInput({
    fieldName,
    viewModel,
    error,
    onChange
}) {
    const rules = viewModel.constructor.fields[fieldName];
    if (!rules) return null;
    const inputId = `product-form-${fieldName}`;
    const errorId = `${inputId}-error`;

    return (
        <label className="product-view__field" htmlFor={inputId}>
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                id={inputId}
                className="product-view__input ui-input"
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
                    className="product-view__field-error ui-message--error"
                >
                    {error}
                </span>
            )}
        </label>
    );
}

function ProductDetail({ viewModel }) {
    const labels = ProductDetailViewModel.labels;

    const fields = [
        ['name', viewModel.name],
        ['price', viewModel.formattedPrice],
        ['enabled', viewModel.enabledName],
        ['url', viewModel.url],
        ['imgPublicId', viewModel.imgPublicId],
        ['description', viewModel.description],
        ['createdDateAt', viewModel.createdDateAt],
        ['createdTimeAt', viewModel.createdTimeAt],
        ['updatedDateAt', viewModel.updatedDateAt],
        ['updatedTimeAt', viewModel.updatedTimeAt]
    ];

    return (
        <dl className="product-detail">
            {fields.map(([fieldName, value]) => (
                <div
                    key={fieldName}
                    className={`product-detail__field ${
                        fieldName === 'description' ? 'product-form__full' : ''
                    }`}
                >
                    <dt>{labels[fieldName]}</dt>
                    <dd>
                        {fieldName === 'enabled' ? (
                            <span
                                className={`product-status-badge ${
                                    viewModel.enabled
                                        ? 'product-status-badge--active'
                                        : 'product-status-badge--inactive'
                                }`}
                            >
                                {viewModel.enabledName}
                            </span>
                        ) : (
                            formatDisplayValue(value)
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default ProductsView;
