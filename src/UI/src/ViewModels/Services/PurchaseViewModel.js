import {
    PURCHASE_INPUT_FIELDS,
    CREATE_PURCHASE_INPUT_FIELDS
} from '../../Validator/Service/PurchaseViewModelValidator';

const PURCHASE_FORM_LABELS = Object.freeze({
    productId: 'Producto',
    userId: 'Usuario comprador',
    petId: 'Mascota asociada (opcional)',
    day: 'Fecha de la compra',
    photoPublicId: 'Comprobante / Fotografía'
});

function formatPurchaseDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? String(value)
        : new Intl.DateTimeFormat('es-SV', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
}

// -----------------------------------------------------------------------------
// List item
// -----------------------------------------------------------------------------

class PurchaseListItemViewModel {
    static labels = Object.freeze({
        productName: 'Producto',
        userName: 'Cliente',
        petName: 'Mascota',
        formattedDay: 'Fecha',
        actions: 'Acciones'
    });

    constructor({
        id,
        productName = '',
        userName = '',
        petName = '',
        day = null
    } = {}) {
        this.id = id;
        this.productName = productName || 'Producto general';
        this.userName = userName || 'Cliente no especificado';
        this.petName = petName || 'Ninguna';
        this.day = day;
        this.formattedDay = formatPurchaseDate(day);
    }
}

// -----------------------------------------------------------------------------
// Paged list
// -----------------------------------------------------------------------------

class PurchaseListViewModel {
    constructor({
        items = [],
        page = 1,
        pageSize = 5,
        totalItems = 0,
        totalPages = 0
    } = {}) {
        this.items = items.map(item =>
            item instanceof PurchaseListItemViewModel
                ? item
                : new PurchaseListItemViewModel(item)
        );

        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}

// -----------------------------------------------------------------------------
// Filters
// -----------------------------------------------------------------------------

class PurchaseFilterViewModel {
    static labels = Object.freeze({
        productName: 'Nombre del producto',
        userName: 'Nombre del cliente',
        petName: 'Nombre de mascota'
    });

    static fields = Object.freeze({
        productName: Object.freeze({
            label: PurchaseFilterViewModel.labels.productName,
            type: 'string'
        }),
        userName: Object.freeze({
            label: PurchaseFilterViewModel.labels.userName,
            type: 'string'
        }),
        petName: Object.freeze({
            label: PurchaseFilterViewModel.labels.petName,
            type: 'string'
        })
    });

    constructor({
        productName = '',
        userName = '',
        petName = ''
    } = {}) {
        this.productName = productName;
        this.userName = userName;
        this.petName = petName;
    }
}

// -----------------------------------------------------------------------------
// Detail
// -----------------------------------------------------------------------------

class PurchaseDetailViewModel {
    static labels = Object.freeze({
        productName: 'Producto',
        userName: 'Cliente',
        petName: 'Mascota asociada',
        formattedDay: 'Fecha de compra',
        photoPublicId: 'Comprobante',
        createdDateAt: 'Fecha de registro',
        createdTimeAt: 'Hora de registro',
        updatedDateAt: 'Fecha de modificación',
        updatedTimeAt: 'Hora de modificación'
    });

    constructor({
        id,
        productId = null,
        productName = '',
        userId = null,
        userName = '',
        petId = null,
        petName = '',
        day = null,
        photoPublicId = null,
        audit = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.productName = productName || 'Producto general';
        this.userId = userId;
        this.userName = userName || 'Cliente no especificado';
        this.petId = petId;
        this.petName = petName || 'Ninguna';
        this.day = day;
        this.formattedDay = formatPurchaseDate(day);
        this.photoPublicId = photoPublicId;

        this.createdDateAt = audit?.createdDateAt ?? null;
        this.createdTimeAt = audit?.createdTimeAt ?? null;
        this.createdTimePeriod = audit?.createdTimePeriod ?? null;
        this.updatedDateAt = audit?.updatedDateAt ?? null;
        this.updatedTimeAt = audit?.updatedTimeAt ?? null;
        this.updatedTimePeriod = audit?.updatedTimePeriod ?? null;
    }
}

// -----------------------------------------------------------------------------
// Create form
// -----------------------------------------------------------------------------

class CreatePurchaseViewModel {
    static fields = CREATE_PURCHASE_INPUT_FIELDS;
    static labels = PURCHASE_FORM_LABELS;

    constructor({
        productId = '',
        userId = '',
        petId = ''
    } = {}) {
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
    }
}

// -----------------------------------------------------------------------------
// Update form
// -----------------------------------------------------------------------------

class UpdatePurchaseViewModel {
    static fields = PURCHASE_INPUT_FIELDS;
    static labels = PURCHASE_FORM_LABELS;

    constructor({
        id,
        productId = '',
        userId = '',
        petId = '',
        day = '',
        photoPublicId = ''
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.petId = petId;
        this.day = day;
        this.photoPublicId = photoPublicId;
    }
}

export {
    PURCHASE_FORM_LABELS,
    PurchaseListItemViewModel,
    PurchaseListViewModel,
    PurchaseFilterViewModel,
    PurchaseDetailViewModel,
    CreatePurchaseViewModel,
    UpdatePurchaseViewModel
};
