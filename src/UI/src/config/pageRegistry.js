// Registro local de páginas conocidas por el bundle de CoffeeShop.
// La API autoriza pageKeys; este registro decide qué código React representa
// cada una. Nunca se debe importar una ruta de archivo recibida desde la API.
const PAGE_KEYS = Object.freeze({
    DASHBOARD_INDEX: 'coffeeshop.dashboard.index'
});

const pageRegistry = Object.freeze({
    [PAGE_KEYS.DASHBOARD_INDEX]: Object.freeze({
        pageKey: PAGE_KEYS.DASHBOARD_INDEX,
        module: 'common',
        defaultPath: '/',
        requiresAuthorization: false
    })
});

export {
    PAGE_KEYS,
    pageRegistry
};
