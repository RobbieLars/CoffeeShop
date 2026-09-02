const { PurchaseDetailDto } = require('../../DTOs/PurchaseDto');

const DEFAULT_PURCHASE_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        productId: '000000000000000000000201',
        productName: 'Cappuccino',
        userId: '000000000000000000000101',
        userName: 'ana.martinez',
        petId: '000000000000000000000001',
        petName: 'Milo',
        day: new Date('2026-08-01T10:30:00.000Z'),
        photoPublicId: 'coffeeshop/purchases/purchase_001'
    },
    {
        id: '000000000000000000000002',
        productId: '000000000000000000000202',
        productName: 'Latte',
        userId: '000000000000000000000102',
        userName: 'carlos.lopez',
        petId: '000000000000000000000002',
        petName: 'Luna',
        day: new Date('2026-08-04T15:20:00.000Z'),
        photoPublicId: null
    },
    {
        id: '000000000000000000000003',
        productId: '000000000000000000000203',
        productName: 'Mocha',
        userId: '000000000000000000000103',
        userName: 'maria.garcia',
        petId: '000000000000000000000003',
        petName: 'Max',
        day: new Date('2026-08-07T09:15:00.000Z'),
        photoPublicId: 'coffeeshop/purchases/purchase_003'
    },
    {
        id: '000000000000000000000004',
        productId: '000000000000000000000204',
        productName: 'Americano',
        userId: '000000000000000000000104',
        userName: 'jose.ramirez',
        petId: '000000000000000000000004',
        petName: 'Rocky',
        day: new Date('2026-08-10T13:40:00.000Z'),
        photoPublicId: null
    },
    {
        id: '000000000000000000000005',
        productId: '000000000000000000000205',
        productName: 'Cold Brew',
        userId: '000000000000000000000105',
        userName: 'sofia.hernandez',
        petId: '000000000000000000000005',
        petName: 'Nala',
        day: new Date('2026-08-13T17:10:00.000Z'),
        photoPublicId: 'coffeeshop/purchases/purchase_005'
    },
    {
        id: '000000000000000000000006',
        productId: '000000000000000000000206',
        productName: 'Espresso',
        userId: '000000000000000000000106',
        userName: 'diego.castillo',
        petId: '000000000000000000000006',
        petName: 'Toby',
        day: new Date('2026-08-16T11:25:00.000Z'),
        photoPublicId: null
    },
    {
        id: '000000000000000000000007',
        productId: '000000000000000000000207',
        productName: 'Caramel Latte',
        userId: '000000000000000000000107',
        userName: 'laura.mendez',
        petId: '000000000000000000000007',
        petName: 'Coco',
        day: new Date('2026-08-19T14:50:00.000Z'),
        photoPublicId: 'coffeeshop/purchases/purchase_007'
    },
    {
        id: '000000000000000000000008',
        productId: '000000000000000000000208',
        productName: 'Chocolate',
        userId: '000000000000000000000108',
        userName: 'andrea.rodriguez',
        petId: '000000000000000000000008',
        petName: 'Simba',
        day: new Date('2026-08-22T08:35:00.000Z'),
        photoPublicId: null
    },
    {
        id: '000000000000000000000009',
        productId: '000000000000000000000209',
        productName: 'Frappé',
        userId: '000000000000000000000109',
        userName: 'fernando.santos',
        petId: '000000000000000000000009',
        petName: 'Kira',
        day: new Date('2026-08-25T16:45:00.000Z'),
        photoPublicId: 'coffeeshop/purchases/purchase_009'
    }
]);

// Base de datos simulada para Purchase.
// Conserva PurchaseDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IPurchaseMockData {
    constructor(items = DEFAULT_PURCHASE_MOCK_ITEMS) {
        this._items = items.map(item => this._toPurchaseDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toPurchaseDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toPurchaseDetailDto(item));
    }

    _toPurchaseDetailDto(item) {
        return new PurchaseDetailDto(item);
    }
}

module.exports = IPurchaseMockData;
