import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import {
    CreateProductViewModel,
    ProductFilterViewModel,
    ProductListViewModel,
    UpdateProductViewModel
} from '../../../ViewModels/Services/ProductViewModel';

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

function useProductsView(controller) {
    if (!controller) {
        throw new Error('useProductsView requiere ProductController.');
    }

    const requestIdRef = useRef(0);

    const [listViewModel, setListViewModel] = useState(
        () => new ProductListViewModel()
    );

    const [filters, setFilters] = useState(
        () => new ProductFilterViewModel()
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

    const loadProducts = useCallback(async () => {
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
        loadProducts();
    }, [loadProducts]);

    const setFilter = useCallback((fieldName, value) => {
        setFilters((currentFilters) =>
            new ProductFilterViewModel({
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
        const emptyFilters = new ProductFilterViewModel();
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
        setFormViewModel(new CreateProductViewModel());
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
            setFormViewModel(new UpdateProductViewModel({
                id: detail.id,
                name: detail.name,
                description: detail.description ?? '',
                imgPublicId: detail.imgPublicId ?? '',
                price: detail.price ?? '',
                url: detail.url ?? '',
                enabled: detail.enabled
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

            const FormType = currentForm instanceof UpdateProductViewModel
                ? UpdateProductViewModel
                : CreateProductViewModel;

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
                ? 'Producto creado exitosamente.'
                : 'Producto actualizado exitosamente.'
        );
        await loadProducts();
    }, [controller, formViewModel, loadProducts, modalMode, submitting]);

    const deleteProduct = useCallback(async (product) => {
        const confirmed = window.confirm(
            `¿Está seguro de eliminar el producto "${product.name}"?`
        );
        if (!confirmed) return;

        setLoading(true);
        const result = await controller.HardDeleteAsync(product.id);
        setLoading(false);

        if (result.successful) {
            setNotification(`Producto "${product.name}" eliminado correctamente.`);
            await loadProducts();
        } else {
            setError(result.message);
        }
    }, [controller, loadProducts]);

    const toggleStatus = useCallback(async (product, nextEnabled) => {
        const result = await controller.PatchEnabledAsync(product.id, nextEnabled);
        if (result.successful) {
            await loadProducts();
        } else {
            setError(result.message);
        }
    }, [controller, loadProducts]);

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
        deleteProduct,
        toggleStatus,
        dismissNotification,
        reload: loadProducts
    };
}

export {
    MODAL_MODES,
    useProductsView
};

export default useProductsView;
