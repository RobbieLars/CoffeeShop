// Registro local de páginas conocidas por el bundle de CoffeeShop.
// La API autoriza pageKeys; este registro decide qué código React representa
// cada una. Nunca se debe importar una ruta de archivo recibida desde la API.
const PAGE_KEYS = Object.freeze({
    DASHBOARD_INDEX: 'coffeeshop.dashboard.index',
    PRODUCTS_INDEX: 'coffeeshop.products.index',
    COMMENTS_INDEX: 'coffeeshop.comments.index',
    PURCHASES_INDEX: 'coffeeshop.purchases.index'
});

const pageRegistry = Object.freeze({
    [PAGE_KEYS.DASHBOARD_INDEX]: Object.freeze({
        pageKey: PAGE_KEYS.DASHBOARD_INDEX,
        module: 'common',
        defaultPath: '/',
        requiresAuthorization: false
    }),
    [PAGE_KEYS.PRODUCTS_INDEX]: Object.freeze({
        pageKey: PAGE_KEYS.PRODUCTS_INDEX,
        module: 'products',
        defaultPath: '/products',
        requiresAuthorization: false
    }),
    [PAGE_KEYS.COMMENTS_INDEX]: Object.freeze({
        pageKey: PAGE_KEYS.COMMENTS_INDEX,
        module: 'comments',
        defaultPath: '/comments',
        requiresAuthorization: false
    }),
    [PAGE_KEYS.PURCHASES_INDEX]: Object.freeze({
        pageKey: PAGE_KEYS.PURCHASES_INDEX,
        module: 'purchases',
        defaultPath: '/purchases',
        requiresAuthorization: false
    })
});

export {
    PAGE_KEYS,
    pageRegistry
};
