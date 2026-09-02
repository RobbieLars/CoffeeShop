const { ProductDetailDto } = require('../../DTOs/ProductDto');

const DEFAULT_PRODUCT_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000201',
        name: 'Cappuccino',
        description: 'Café espresso con leche vaporizada y espuma de leche.',
        imgPublicId: 'coffeeshop/products/cappuccino',
        price: 3.50,
        url: '/products/cappuccino',
        enabled: true
    },
    {
        id: '000000000000000000000202',
        name: 'Latte',
        description: 'Café espresso suave preparado con abundante leche vaporizada.',
        imgPublicId: 'coffeeshop/products/latte',
        price: 3.75,
        url: '/products/latte',
        enabled: true
    },
    {
        id: '000000000000000000000203',
        name: 'Mocha',
        description: 'Café espresso con chocolate y leche vaporizada.',
        imgPublicId: 'coffeeshop/products/mocha',
        price: 4.25,
        url: '/products/mocha',
        enabled: true
    },
    {
        id: '000000000000000000000204',
        name: 'Americano',
        description: 'Café espresso combinado con agua caliente.',
        imgPublicId: 'coffeeshop/products/americano',
        price: 2.75,
        url: '/products/americano',
        enabled: true
    },
    {
        id: '000000000000000000000205',
        name: 'Cold Brew',
        description: 'Café preparado mediante extracción en frío.',
        imgPublicId: 'coffeeshop/products/cold_brew',
        price: 4.00,
        url: '/products/cold-brew',
        enabled: true
    },
    {
        id: '000000000000000000000206',
        name: 'Espresso',
        description: 'Café concentrado preparado mediante extracción a presión.',
        imgPublicId: 'coffeeshop/products/espresso',
        price: 2.25,
        url: '/products/espresso',
        enabled: true
    },
    {
        id: '000000000000000000000207',
        name: 'Caramel Latte',
        description: 'Latte preparado con jarabe de caramelo.',
        imgPublicId: 'coffeeshop/products/caramel_latte',
        price: 4.50,
        url: '/products/caramel-latte',
        enabled: true
    },
    {
        id: '000000000000000000000208',
        name: 'Chocolate',
        description: 'Bebida caliente preparada con chocolate y leche.',
        imgPublicId: 'coffeeshop/products/chocolate',
        price: 3.25,
        url: '/products/chocolate',
        enabled: false
    },
    {
        id: '000000000000000000000209',
        name: 'Frappé',
        description: 'Bebida fría de café mezclada con hielo.',
        imgPublicId: 'coffeeshop/products/frappe',
        price: 4.75,
        url: '/products/frappe',
        enabled: false
    }
]);

// Base de datos simulada para Product.
// Conserva ProductDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IProductMockData {
    constructor(items = DEFAULT_PRODUCT_MOCK_ITEMS) {
        this._items = items.map(item => this._toProductDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toProductDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toProductDetailDto(item));
    }

    _toProductDetailDto(item) {
        return new ProductDetailDto(item);
    }
}

module.exports = IProductMockData;