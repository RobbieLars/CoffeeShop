import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import {
    CreatePetViewModel,
    PetFilterViewModel,
    PetListViewModel,
    UpdatePetViewModel
} from '../../../ViewModels/Services/PetViewModel';

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

function usePetsView(controller) {
    if (!controller) {
        throw new Error(
            'usePetsView requiere PetController.'
        );
    }

    const requestIdRef = useRef(0);

    const [listViewModel, setListViewModel] = useState(
        () => new PetListViewModel()
    );

    const [filters, setFilters] = useState(
        () => new PetFilterViewModel()
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

    const loadPets = useCallback(async () => {
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
        loadPets();
    }, [loadPets]);

    const setFilter = useCallback((fieldName, value) => {
        setFilters((currentFilters) =>
            new PetFilterViewModel({
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
        const emptyFilters = new PetFilterViewModel();

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
        setFormViewModel(new CreatePetViewModel());
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
            setFormViewModel(new UpdatePetViewModel({
                id: detail.id,
                ownerId: detail.ownerId,
                photoPublicId: detail.photoPublicId,
                name: detail.name,
                type: detail.type,
                birthDate: toDateInputValue(detail.birthDate),
                gender: detail.gender,
                weight: detail.weight ?? '',
                favoriteFood: detail.favoriteFood ?? '',
                privacy: detail.privacy
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

            const FormType = currentForm instanceof UpdatePetViewModel
                ? UpdatePetViewModel
                : CreatePetViewModel;

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
            : await controller.UpdateAsync(
                formViewModel.id,
                formViewModel
            );

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
        await loadPets();
    }, [
        controller,
        formViewModel,
        loadPets,
        modalMode,
        submitting
    ]);

    const changePageSize = useCallback((nextPageSize) => {
        setPageSize(Number(nextPageSize));
        setPage(1);
    }, []);

    const showDeleteNotification = useCallback((pet) => {
        setNotification(
            `Eliminación simulada para ${pet.name}. ` +
            'No se envió ninguna solicitud.'
        );
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
        showDeleteNotification,
        dismissNotification,
        reload: loadPets
    };
}

export {
    MODAL_MODES,
    usePetsView
};

export default usePetsView;
