import {
    PRODUCT_INPUT_FIELDS,
    CREATE_PRODUCT_INPUT_FIELDS
} from '../../Validator/Service/ProductViewModelValidator';

const PRODUCT_FORM_LABELS = Object.freeze({
    name: 'Nombre del producto',
    description: 'Descripción',
    imgPublicId: 'Identificador de imagen',
    price: 'Precio ($)',
    url: 'URL amigable',
    enabled: 'Estado activo'
});

// -----------------------------------------------------------------------------
// List item
// -----------------------------------------------------------------------------

class ProductListItemViewModel {
    static labels = Object.freeze({
        name: 'Producto',
        price: 'Precio',
        enabled: 'Estado',
        imgPublicId: 'Imagen',
        actions: 'Acciones'
    });

    constructor({
        id,
        name,
        imgPublicId = null,
        price = 0,
        enabled = true
    } = {}) {
        this.id = id;
        this.name = name;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.enabled = Boolean(enabled);
        this.enabledName = this.enabled ? 'Activo' : 'Inactivo';
        this.formattedPrice = `$${Number(price || 0).toFixed(2)}`;
    }
}

// -----------------------------------------------------------------------------
// Paged list
// -----------------------------------------------------------------------------

class ProductListViewModel {
    constructor({
        items = [],
        page = 1,
        pageSize = 5,
        totalItems = 0,
        totalPages = 0
    } = {}) {
        this.items = items.map(item =>
            item instanceof ProductListItemViewModel
                ? item
                : new ProductListItemViewModel(item)
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

class ProductFilterViewModel {
    static labels = Object.freeze({
        name: 'Nombre del producto',
        minPrice: 'Precio mínimo',
        maxPrice: 'Precio máximo',
        enabled: 'Estado'
    });

    static fields = Object.freeze({
        name: Object.freeze({
            label: ProductFilterViewModel.labels.name,
            type: 'string'
        }),
        minPrice: Object.freeze({
            label: ProductFilterViewModel.labels.minPrice,
            type: 'number'
        }),
        maxPrice: Object.freeze({
            label: ProductFilterViewModel.labels.maxPrice,
            type: 'number'
        })
    });

    constructor({
        name = '',
        minPrice = '',
        maxPrice = '',
        enabled = ''
    } = {}) {
        this.name = name;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.enabled = enabled;
    }
}

// -----------------------------------------------------------------------------
// Detail
// -----------------------------------------------------------------------------

class ProductDetailViewModel {
    static labels = Object.freeze({
        name: 'Nombre',
        description: 'Descripción',
        imgPublicId: 'Imagen',
        price: 'Precio',
        url: 'URL',
        enabled: 'Estado',
        createdDateAt: 'Fecha de creación',
        createdTimeAt: 'Hora de creación',
        updatedDateAt: 'Fecha de modificación',
        updatedTimeAt: 'Hora de modificación'
    });

    constructor({
        id,
        name,
        description = null,
        imgPublicId = null,
        price = 0,
        url = null,
        enabled = true,
        audit = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.formattedPrice = `$${Number(price || 0).toFixed(2)}`;
        this.url = url;
        this.enabled = Boolean(enabled);
        this.enabledName = this.enabled ? 'Activo' : 'Inactivo';

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

class CreateProductViewModel {
    static fields = CREATE_PRODUCT_INPUT_FIELDS;
    static labels = PRODUCT_FORM_LABELS;

    constructor({
        name = '',
        description = '',
        imgPublicId = '',
        price = '',
        url = ''
    } = {}) {
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
    }
}

// -----------------------------------------------------------------------------
// Update form
// -----------------------------------------------------------------------------

class UpdateProductViewModel {
    static fields = PRODUCT_INPUT_FIELDS;
    static labels = PRODUCT_FORM_LABELS;

    constructor({
        id,
        name = '',
        description = '',
        imgPublicId = '',
        price = '',
        url = '',
        enabled = true
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPublicId = imgPublicId;
        this.price = price;
        this.url = url;
        this.enabled = enabled;
    }
}

export {
    PRODUCT_FORM_LABELS,
    ProductListItemViewModel,
    ProductListViewModel,
    ProductFilterViewModel,
    ProductDetailViewModel,
    CreateProductViewModel,
    UpdateProductViewModel
};
