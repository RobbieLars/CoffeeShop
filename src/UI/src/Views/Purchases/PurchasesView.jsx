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
    PurchaseDetailViewModel,
    PurchaseFilterViewModel,
    PurchaseListItemViewModel
} from '../../ViewModels/Services/PurchaseViewModel';

import { usePurchasesView } from '../../wwwroot/js/HookViews/usePurchasesView';
import '../../wwwroot/css/Views/PurchasesView.css';

const DEFAULT_PRODUCT_OPTIONS = Object.freeze([
    Object.freeze({ value: '000000000000000000000201', label: 'Cappuccino', code: '000000000000000000000201', name: 'Cappuccino' }),
    Object.freeze({ value: '000000000000000000000202', label: 'Latte', code: '000000000000000000000202', name: 'Latte' }),
    Object.freeze({ value: '000000000000000000000203', label: 'Mocha', code: '000000000000000000000203', name: 'Mocha' }),
    Object.freeze({ value: '000000000000000000000204', label: 'Americano', code: '000000000000000000000204', name: 'Americano' }),
    Object.freeze({ value: '000000000000000000000205', label: 'Cold Brew', code: '000000000000000000000205', name: 'Cold Brew' })
]);

const DEFAULT_USER_OPTIONS = Object.freeze([
    Object.freeze({ value: '000000000000000000000101', label: 'ana.martinez', code: '000000000000000000000101', name: 'ana.martinez' }),
    Object.freeze({ value: '000000000000000000000102', label: 'carlos.lopez', code: '000000000000000000000102', name: 'carlos.lopez' }),
    Object.freeze({ value: '000000000000000000000103', label: 'maria.garcia', code: '000000000000000000000103', name: 'maria.garcia' }),
    Object.freeze({ value: '000000000000000000000104', label: 'jose.ramirez', code: '000000000000000000000104', name: 'jose.ramirez' }),
    Object.freeze({ value: '000000000000000000000105', label: 'sofia.hernandez', code: '000000000000000000000105', name: 'sofia.hernandez' })
]);

const DEFAULT_PET_OPTIONS = Object.freeze([
    Object.freeze({ value: '000000000000000000000001', label: 'Milo', code: '000000000000000000000001', name: 'Milo' }),
    Object.freeze({ value: '000000000000000000000002', label: 'Luna', code: '000000000000000000000002', name: 'Luna' }),
    Object.freeze({ value: '000000000000000000000003', label: 'Max', code: '000000000000000000000003', name: 'Max' }),
    Object.freeze({ value: '000000000000000000000004', label: 'Rocky', code: '000000000000000000000004', name: 'Rocky' }),
    Object.freeze({ value: '000000000000000000000005', label: 'Nala', code: '000000000000000000000005', name: 'Nala' })
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

function PurchaseActionsMenu({
    purchase,
    onDetail,
    onEdit,
    onDelete
}) {
    return (
        <ActionMenu
            ariaLabel={`Acciones para compra #${purchase.id}`}
            className="purchase-view__action-menu"
            triggerClassName="purchase-view__action-trigger"
            menuClassName="purchase-view__action-list"
            itemClassName="purchase-view__action-item"
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

function PurchasesView({
    controller,
    productOptions = [],
    userOptions = [],
    petOptions = []
}) {
    const view = usePurchasesView(controller);

    const resolvedProductOptions = useMemo(() =>
        mergeOptions(
            productOptions.length > 0 ? productOptions : DEFAULT_PRODUCT_OPTIONS,
            []
        ),
    [productOptions]);

    const resolvedUserOptions = useMemo(() =>
        mergeOptions(
            userOptions.length > 0 ? userOptions : DEFAULT_USER_OPTIONS,
            []
        ),
    [userOptions]);

    const resolvedPetOptions = useMemo(() =>
        mergeOptions(
            petOptions.length > 0 ? petOptions : DEFAULT_PET_OPTIONS,
            []
        ),
    [petOptions]);

    const columns = [
        {
            id: 'productName',
            header: PurchaseListItemViewModel.labels.productName,
            accessor: 'productName'
        },
        {
            id: 'userName',
            header: PurchaseListItemViewModel.labels.userName,
            accessor: 'userName'
        },
        {
            id: 'petName',
            header: PurchaseListItemViewModel.labels.petName,
            accessor: 'petName'
        },
        {
            id: 'formattedDay',
            header: PurchaseListItemViewModel.labels.formattedDay,
            accessor: 'formattedDay'
        },
        {
            id: 'actions',
            header: PurchaseListItemViewModel.labels.actions,
            searchable: false,
            render: (_, purchase) => (
                <div className="purchase-view__row-actions">
                    <PurchaseActionsMenu
                        purchase={purchase}
                        onEdit={() =>
                            view.openUpdateModal(purchase.id)
                        }
                        onDetail={() =>
                            view.openDetailModal(purchase.id)
                        }
                        onDelete={() =>
                            view.deletePurchase(purchase)
                        }
                    />
                </div>
            )
        }
    ];

    const modalTitle = {
        [view.MODAL_MODES.CREATE]: 'Registrar compra',
        [view.MODAL_MODES.DETAIL]: 'Detalle de compra',
        [view.MODAL_MODES.UPDATE]: 'Actualizar compra'
    }[view.modalMode];

    const formId = `purchase-${view.modalMode ?? 'form'}`;

    const modalFooter = view.modalMode === view.MODAL_MODES.DETAIL
        ? (
            <button
                type="button"
                className="purchase-view__button ui-button"
                onClick={view.closeModal}
            >
                Cerrar
            </button>
        )
        : (
            <>
                <button
                    type="button"
                    className="purchase-view__button ui-button"
                    disabled={view.submitting}
                    onClick={view.closeModal}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    form={formId}
                    className="purchase-view__button ui-button ui-button--primary"
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
            title="Historial de Compras"
            description="Registro y trazabilidad de compras de café, insumos y productos asociados a clientes y mascotas."
            className="purchase-view"
            actions={(
                <button
                    type="button"
                    className="purchase-view__button ui-button ui-button--primary"
                    onClick={view.openCreateModal}
                >
                    Registrar compra
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
                    fieldName="productName"
                    value={view.filters.productName}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="userName"
                    value={view.filters.userName}
                    onChange={view.setFilter}
                />

                <FilterInput
                    fieldName="petName"
                    value={view.filters.petName}
                    onChange={view.setFilter}
                />
            </FilterPanel>

            {view.error && (
                <div
                    className="purchase-view__message ui-message--error"
                    role="alert"
                >
                    {view.error}
                    <button
                        type="button"
                        className="purchase-view__button ui-button"
                        onClick={view.reload}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {view.notification && (
                <div
                    className="purchase-view__message ui-notification"
                    role="status"
                >
                    <span>{view.notification}</span>

                    <button
                        type="button"
                        className="purchase-view__button ui-button"
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
                emptyMessage="No hay registros de compras para mostrar."
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
                    <div className="purchase-view__message">
                        Cargando información...
                    </div>
                )}

                {view.modalError && (
                    <div
                        className="purchase-view__message ui-message--error"
                        role="alert"
                    >
                        {view.modalError}
                    </div>
                )}

                {!view.modalLoading &&
                    view.modalMode === view.MODAL_MODES.DETAIL &&
                    view.detailViewModel && (
                        <PurchaseDetail
                            viewModel={view.detailViewModel}
                        />
                    )}

                {!view.modalLoading &&
                    view.modalMode !== view.MODAL_MODES.DETAIL &&
                    view.formViewModel && (
                        <PurchaseForm
                            id={formId}
                            viewModel={view.formViewModel}
                            productOptions={resolvedProductOptions}
                            userOptions={resolvedUserOptions}
                            petOptions={resolvedPetOptions}
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
    const rules = PurchaseFilterViewModel.fields[fieldName];

    return (
        <label className="purchase-view__field">
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                className="purchase-view__input ui-input"
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

function PurchaseForm({
    id,
    viewModel,
    productOptions,
    userOptions,
    petOptions,
    errors,
    onFieldChange,
    onSubmit
}) {
    const labels = viewModel.constructor.labels;

    return (
        <form
            id={id}
            className="purchase-form"
            noValidate
            onSubmit={onSubmit}
        >
            <ComboBox
                label={labels.productId}
                value={viewModel.productId}
                options={productOptions}
                searchable
                searchTypes={[
                    {
                        id: 'code',
                        label: 'Código',
                        accessor: 'code'
                    },
                    {
                        id: 'name',
                        label: 'Producto',
                        accessor: 'name'
                    }
                ]}
                onChange={(option) =>
                    onFieldChange('productId', option?.value ?? '')
                }
            />

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

            <ComboBox
                label={labels.petId}
                value={viewModel.petId}
                options={petOptions}
                searchable
                searchTypes={[
                    {
                        id: 'code',
                        label: 'Código',
                        accessor: 'code'
                    },
                    {
                        id: 'name',
                        label: 'Mascota',
                        accessor: 'name'
                    }
                ]}
                onChange={(option) =>
                    onFieldChange('petId', option?.value ?? '')
                }
            />

            {'day' in viewModel && (
                <PurchaseFormInput
                    fieldName="day"
                    viewModel={viewModel}
                    error={errors?.day}
                    onChange={onFieldChange}
                />
            )}

            {'photoPublicId' in viewModel && (
                <PurchaseFormInput
                    fieldName="photoPublicId"
                    viewModel={viewModel}
                    error={errors?.photoPublicId}
                    onChange={onFieldChange}
                />
            )}
        </form>
    );
}

function PurchaseFormInput({
    fieldName,
    viewModel,
    error,
    onChange
}) {
    const rules = viewModel.constructor.fields[fieldName];
    if (!rules) return null;
    const inputId = `purchase-form-${fieldName}`;
    const errorId = `${inputId}-error`;

    return (
        <label className="purchase-view__field" htmlFor={inputId}>
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                id={inputId}
                className="purchase-view__input ui-input"
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
                    className="purchase-view__field-error ui-message--error"
                >
                    {error}
                </span>
            )}
        </label>
    );
}

function PurchaseDetail({ viewModel }) {
    const labels = PurchaseDetailViewModel.labels;

    const fields = [
        ['productName', viewModel.productName],
        ['userName', viewModel.userName],
        ['petName', viewModel.petName],
        ['formattedDay', viewModel.formattedDay],
        ['photoPublicId', viewModel.photoPublicId],
        ['createdDateAt', viewModel.createdDateAt],
        ['createdTimeAt', viewModel.createdTimeAt],
        ['updatedDateAt', viewModel.updatedDateAt],
        ['updatedTimeAt', viewModel.updatedTimeAt]
    ];

    return (
        <dl className="purchase-detail">
            {fields.map(([fieldName, value]) => (
                <div
                    key={fieldName}
                    className={`purchase-detail__field ${
                        fieldName === 'photoPublicId' ? 'purchase-form__full' : ''
                    }`}
                >
                    <dt>{labels[fieldName]}</dt>
                    <dd>{formatDisplayValue(value)}</dd>
                </div>
            ))}
        </dl>
    );
}

export default PurchasesView;
