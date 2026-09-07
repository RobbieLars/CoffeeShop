import {
    useEffect,
    useMemo,
    useRef,
    useState
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
    PetDetailViewModel,
    PetFilterViewModel,
    PetListItemViewModel
} from '../../ViewModels/Services/PetViewModel';

import { usePetsView } from '../../wwwroot/js/HookViews/usePetsView';
import '../../wwwroot/css/Views/PetsView.css';

const PRIVACY_OPTIONS = Object.freeze([
    Object.freeze({ value: false, label: 'Pública' }),
    Object.freeze({ value: true, label: 'Privada' })
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

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? String(value)
        : new Intl.DateTimeFormat('es-SV').format(date);
}

function PetActionsMenu({
    pet,
    onDetail,
    onEdit,
    onDelete
}) {
    return (
        <ActionMenu
            ariaLabel={`Acciones para ${pet.name}`}
            className="pet-view__action-menu"
            triggerClassName="pet-view__action-trigger"
            menuClassName="pet-view__action-list"
            itemClassName="pet-view__action-item"
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

function PetsView({
    controller,
    ownerOptions = [],
    typeOptions = [],
    genderOptions = []
}) {
    const view = usePetsView(controller);

    const resolvedOwnerOptions = useMemo(() =>
        mergeOptions(
            ownerOptions,
            view.listViewModel.items
                .filter((item) => item.ownerId)
                .map((item) => ({
                    value: item.ownerId,
                    label: item.ownerName ?? item.ownerId,
                    code: item.ownerId,
                    name: item.ownerName ?? ''
                }))
        ),
    [ownerOptions, view.listViewModel.items]);

    const resolvedTypeOptions = useMemo(() =>
        mergeOptions(
            typeOptions,
            view.listViewModel.items
                .filter((item) => item.type !== undefined)
                .map((item) => ({
                    value: item.type,
                    label: item.typeName ?? String(item.type),
                    code: item.type,
                    name: item.typeName ?? ''
                }))
        ),
    [typeOptions, view.listViewModel.items]);

    const columns = [
        {
            id: 'name',
            header: PetListItemViewModel.labels.name,
            accessor: 'name'
        },
        {
            id: 'ownerName',
            header: PetListItemViewModel.labels.ownerName,
            accessor: 'ownerName'
        },
        {
            id: 'typeName',
            header: PetListItemViewModel.labels.typeName,
            accessor: 'typeName'
        },
        {
            id: 'privacyName',
            header: PetListItemViewModel.labels.privacy,
            accessor: 'privacyName'
        },
        {
            id: 'actions',
            header: PetListItemViewModel.labels.actions,
            searchable: false,
            render: (_, pet) => (
                <div className="pet-view__row-actions">
                    <PetActionsMenu
                        pet={pet}
                        onEdit={() =>
                            view.openUpdateModal(pet.id)
                        }
                        onDetail={() =>
                            view.openDetailModal(pet.id)
                        }
                        onDelete={() =>
                            view.showDeleteNotification(pet)
                        }
                    />
                </div>
            )
        }
    ];

    const modalTitle = {
        [view.MODAL_MODES.CREATE]: 'Crear mascota',
        [view.MODAL_MODES.DETAIL]: 'Detalle de mascota',
        [view.MODAL_MODES.UPDATE]: 'Actualizar mascota'
    }[view.modalMode];

    const formId = `pet-${view.modalMode ?? 'form'}`;

    const modalFooter = view.modalMode === view.MODAL_MODES.DETAIL
        ? (
            <button
                type="button"
                className="pet-view__button ui-button"
                onClick={view.closeModal}
            >
                Cerrar
            </button>
        )
        : (
            <>
                <button
                    type="button"
                    className="pet-view__button ui-button"
                    disabled={view.submitting}
                    onClick={view.closeModal}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    form={formId}
                    className="pet-view__button ui-button ui-button--primary"
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
            title="Mascotas"
            description="Consulta y administra las mascotas registradas."
            className="pet-view"
            actions={(
                <button
                    type="button"
                    className="pet-view__button ui-button ui-button--primary"
                    onClick={view.openCreateModal}
                >
                    Crear mascota
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
                    fieldName="ownerName"
                    value={view.filters.ownerName}
                    onChange={view.setFilter}
                />

                <FilterComboBox
                    label={PetFilterViewModel.labels.ownerId}
                    value={view.filters.ownerId}
                    options={resolvedOwnerOptions}
                    onChange={(value) =>
                        view.setFilter('ownerId', value)
                    }
                    searchTypes={[
                        {
                            id: 'code',
                            label: 'Código',
                            accessor: 'code'
                        },
                        {
                            id: 'name',
                            label: 'Nombre',
                            accessor: 'name'
                        }
                    ]}
                />

                <FilterComboBox
                    label={PetFilterViewModel.labels.type}
                    value={view.filters.type}
                    options={resolvedTypeOptions}
                    onChange={(value) =>
                        view.setFilter('type', value)
                    }
                />

                <FilterComboBox
                    label={PetFilterViewModel.labels.gender}
                    value={view.filters.gender}
                    options={genderOptions}
                    onChange={(value) =>
                        view.setFilter('gender', value)
                    }
                />

                <FilterComboBox
                    label={PetFilterViewModel.labels.privacy}
                    value={view.filters.privacy}
                    options={PRIVACY_OPTIONS}
                    onChange={(value) =>
                        view.setFilter('privacy', value)
                    }
                />
            </FilterPanel>

            {view.error && (
                <div
                    className="pet-view__message ui-message--error"
                    role="alert"
                >
                    {view.error}
                    <button
                        type="button"
                        className="pet-view__button ui-button"
                        onClick={view.reload}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {view.notification && (
                <div
                    className="pet-view__message ui-notification"
                    role="status"
                >
                    <span>{view.notification}</span>

                    <button
                        type="button"
                        className="pet-view__button ui-button"
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
                emptyMessage="No hay mascotas para mostrar."
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
                    <div className="pet-view__message">
                        Cargando información...
                    </div>
                )}

                {view.modalError && (
                    <div
                        className="pet-view__message ui-message--error"
                        role="alert"
                    >
                        {view.modalError}
                    </div>
                )}

                {!view.modalLoading &&
                    view.modalMode === view.MODAL_MODES.DETAIL &&
                    view.detailViewModel && (
                        <PetDetail
                            viewModel={view.detailViewModel}
                        />
                    )}

                {!view.modalLoading &&
                    view.modalMode !== view.MODAL_MODES.DETAIL &&
                    view.formViewModel && (
                        <PetForm
                            id={formId}
                            viewModel={view.formViewModel}
                            ownerOptions={resolvedOwnerOptions}
                            typeOptions={resolvedTypeOptions}
                            genderOptions={genderOptions}
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
    const rules = PetFilterViewModel.fields[fieldName];

    return (
        <label className="pet-view__field">
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                className="pet-view__input ui-input"
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
    onChange,
    searchTypes = []
}) {
    return (
        <ComboBox
            label={label}
            value={value}
            options={options}
            searchable
            clearable={false}
            searchTypes={searchTypes}
            onChange={(option) =>
                onChange(option ? (option.value ?? null) : null)
            }
        />
    );
}

function PetForm({
    id,
    viewModel,
    ownerOptions,
    typeOptions,
    genderOptions,
    errors,
    onFieldChange,
    onSubmit
}) {
    const labels = viewModel.constructor.labels;

    return (
        <form
            id={id}
            className="pet-form"
            noValidate
            onSubmit={onSubmit}
        >
            <ComboBox
                label={labels.ownerId}
                value={viewModel.ownerId}
                options={ownerOptions}
                searchable
                searchTypes={[
                    {
                        id: 'code',
                        label: 'Código',
                        accessor: 'code'
                    },
                    {
                        id: 'name',
                        label: 'Nombre',
                        accessor: 'name'
                    }
                ]}
                onChange={(option) =>
                    onFieldChange('ownerId', option?.value ?? '')
                }
            />

            <ComboBox
                label={labels.type}
                value={viewModel.type}
                options={typeOptions}
                searchable
                onChange={(option) =>
                    onFieldChange('type', option?.value ?? '')
                }
            />

            <ComboBox
                label={labels.gender}
                value={viewModel.gender}
                options={genderOptions}
                searchable
                onChange={(option) =>
                    onFieldChange('gender', option?.value ?? '')
                }
            />

            {Object.keys(viewModel.constructor.fields).map(
                (fieldName) => (
                    <PetFormInput
                        key={fieldName}
                        fieldName={fieldName}
                        viewModel={viewModel}
                        error={errors?.[fieldName]}
                        onChange={onFieldChange}
                    />
                )
            )}

            {'privacy' in viewModel && (
                <div className="pet-form__field">
                    <ToggleSwitch
                        id="pet-form-privacy"
                        label={labels.privacy}
                        checked={Boolean(viewModel.privacy)}
                        onChange={(checked) =>
                            onFieldChange('privacy', checked)
                        }
                        yesLabel="SI"
                        noLabel="NO"
                    />
                </div>
            )}
        </form>
    );
}

function PetFormInput({
    fieldName,
    viewModel,
    error,
    onChange
}) {
    const rules = viewModel.constructor.fields[fieldName];
    const inputId = `pet-form-${fieldName}`;
    const errorId = `${inputId}-error`;

    return (
        <label className="pet-view__field" htmlFor={inputId}>
            <span>{rules.label}</span>
            <input
                {...ViewModelFieldHelper.buildInputProps(rules)}
                id={inputId}
                className="pet-view__input ui-input"
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
                    className="pet-view__field-error ui-message--error"
                >
                    {error}
                </span>
            )}
        </label>
    );
}

function PetDetail({ viewModel }) {
    const labels = PetDetailViewModel.labels;

    const fields = [
        ['name', viewModel.name],
        ['ownerName', viewModel.ownerName],
        ['typeName', viewModel.typeName],
        ['birthDate', formatDate(viewModel.birthDate)],
        ['gender', viewModel.gender],
        ['weight', viewModel.weight],
        ['favoriteFood', viewModel.favoriteFood],
        ['privacy', viewModel.privacyName],
        ['createdDateAt', viewModel.createdDateAt],
        ['createdTimeAt', viewModel.createdTimeAt],
        ['updatedDateAt', viewModel.updatedDateAt],
        ['updatedTimeAt', viewModel.updatedTimeAt]
    ];

    return (
        <dl className="pet-detail">
            {fields.map(([fieldName, value]) => (
                <div key={fieldName} className="pet-detail__field">
                    <dt>{labels[fieldName]}</dt>
                    <dd>{formatDisplayValue(value)}</dd>
                </div>
            ))}
        </dl>
    );
}

export default PetsView;
