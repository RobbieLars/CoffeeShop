import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import {
    CreatePurchaseViewModel,
    PurchaseFilterViewModel,
    PurchaseListViewModel,
    UpdatePurchaseViewModel
} from '../../../ViewModels/Services/PurchaseViewModel';

const MODAL_MODES = Object.freeze({
    CREATE: 'create',
    DETAIL: 'detail',
    UPDATE: 'update'
});

function removeEmptyFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => (
            value !== '' &&
            value !== null &&
            value !== undefined
        ))
    );
}

function toDateInputValue(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? String(value).slice(0, 10)
        : date.toISOString().slice(0, 10);
}

function usePurchasesView(controller) {
    if (!controller) {
        throw new Error('usePurchasesView requiere PurchaseController.');
    }

    const requestIdRef = useRef(0);

    const [listViewModel, setListViewModel] = useState(
        () => new PurchaseListViewModel()
    );

    const [filters, setFilters] = useState(
        () => new PurchaseFilterViewModel()
    );

    const [appliedFilters, setAppliedFilters] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    const [modalMode, setModalMode] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [detailViewModel, setDetailViewModel] = useState(null);
    const [formViewModel, setFormViewModel] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadPurchases = useCallback(async () => {
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        setLoading(true);
        setError(null);

        const result = await controller.GetPagedAsync({
            page,
            pageSize,
            filters: removeEmptyFilters(appliedFilters)
        });

        if (requestId !== requestIdRef.current) {
            return;
        }

        if (result.successful) {
            setListViewModel(result.data);
        } else {
            setError(result.message);
        }

        setLoading(false);
    }, [controller, page, pageSize, appliedFilters]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);

    const setFilter = useCallback((fieldName, value) => {
        setFilters((currentFilters) =>
            new PurchaseFilterViewModel({
                ...currentFilters,
                [fieldName]: value
            })
        );
    }, []);

    const applyFilters = useCallback((event) => {
        event?.preventDefault();
        setPage(1);
        setAppliedFilters({ ...filters });
    }, [filters]);

    const clearFilters = useCallback(() => {
        const emptyFilters = new PurchaseFilterViewModel();
        setFilters(emptyFilters);
        setAppliedFilters({});
        setPage(1);
    }, []);

    const closeModal = useCallback(() => {
        if (submitting) {
            return;
        }

        setModalMode(null);
        setModalLoading(false);
        setModalError(null);
        setFormErrors({});
        setDetailViewModel(null);
        setFormViewModel(null);
    }, [submitting]);

    const openCreateModal = useCallback(() => {
        setModalMode(MODAL_MODES.CREATE);
        setModalError(null);
        setFormErrors({});
        setDetailViewModel(null);
        setFormViewModel(new CreatePurchaseViewModel());
    }, []);

    const openDetailModal = useCallback(async (id) => {
        setModalMode(MODAL_MODES.DETAIL);
        setModalLoading(true);
        setModalError(null);
        setDetailViewModel(null);

        const result = await controller.GetByIdAsync(id);

        if (result.successful) {
            setDetailViewModel(result.data);
        } else {
            setModalError(result.message);
        }

        setModalLoading(false);
    }, [controller]);

    const openUpdateModal = useCallback(async (id) => {
        setModalMode(MODAL_MODES.UPDATE);
        setModalLoading(true);
        setModalError(null);
        setFormErrors({});
        setFormViewModel(null);

        const result = await controller.GetByIdAsync(id);

        if (result.successful) {
            const detail = result.data;
            setDetailViewModel(detail);
            setFormViewModel(new UpdatePurchaseViewModel({
                id: detail.id,
                productId: detail.productId ?? '',
                userId: detail.userId ?? '',
                petId: detail.petId ?? '',
                day: toDateInputValue(detail.day),
                photoPublicId: detail.photoPublicId ?? ''
            }));
        } else {
            setModalError(result.message);
        }

        setModalLoading(false);
    }, [controller]);

    const setFormField = useCallback((fieldName, value) => {
        setFormViewModel((currentForm) => {
            if (!currentForm) {
                return currentForm;
            }

            const FormType = currentForm instanceof UpdatePurchaseViewModel
                ? UpdatePurchaseViewModel
                : CreatePurchaseViewModel;

            return new FormType({
                ...currentForm,
                [fieldName]: value
            });
        });
    }, []);

    const submitForm = useCallback(async (event) => {
        event?.preventDefault();

        if (!formViewModel || submitting) {
            return;
        }

        setSubmitting(true);
        setModalError(null);
        setFormErrors({});

        const result = modalMode === MODAL_MODES.CREATE
            ? await controller.CreateAsync(formViewModel)
            : await controller.UpdateAsync(formViewModel.id, formViewModel);

        if (!result.successful) {
            setModalError(result.message);
            setFormErrors(result.errors ?? {});
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        setModalMode(null);
        setDetailViewModel(null);
        setFormViewModel(null);
        setNotification(
            modalMode === MODAL_MODES.CREATE
                ? 'Compra registrada exitosamente.'
                : 'Compra actualizada exitosamente.'
        );
        await loadPurchases();
    }, [controller, formViewModel, loadPurchases, modalMode, submitting]);

    const deletePurchase = useCallback(async (purchase) => {
        const confirmed = window.confirm(
            `¿Está seguro de eliminar el registro de compra #${purchase.id}?`
        );
        if (!confirmed) return;

        setLoading(true);
        const result = await controller.HardDeleteAsync(purchase.id);
        setLoading(false);

        if (result.successful) {
            setNotification('Registro de compra eliminado correctamente.');
            await loadPurchases();
        } else {
            setError(result.message);
        }
    }, [controller, loadPurchases]);

    const changePageSize = useCallback((nextPageSize) => {
        setPageSize(Number(nextPageSize));
        setPage(1);
    }, []);

    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        MODAL_MODES,
        listViewModel,
        filters,
        loading,
        error,
        notification,
        page,
        pageSize,
        modalMode,
        modalLoading,
        modalError,
        formErrors,
        detailViewModel,
        formViewModel,
        submitting,
        setFilter,
        applyFilters,
        clearFilters,
        setPage,
        changePageSize,
        openCreateModal,
        openDetailModal,
        openUpdateModal,
        closeModal,
        setFormField,
        submitForm,
        deletePurchase,
        dismissNotification,
        reload: loadPurchases
    };
}

export {
    MODAL_MODES,
    usePurchasesView
};

export default usePurchasesView;
