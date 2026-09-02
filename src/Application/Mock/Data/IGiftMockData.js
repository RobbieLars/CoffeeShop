const { GiftDetailDto } = require('../../DTOs/GiftDto');

const DEFAULT_GIFT_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        userId: '000000000000000000000101',
        userName: 'ana.martinez',
        productId: '000000000000000000000201',
        productName: 'Cappuccino',
        productImgPublicId: 'coffeeshop/products/cappuccino',
        petId: '000000000000000000000001',
        petName: 'Milo',
        giftReceived: true,
        googlePhotoPetUrl: 'https://photos.google.com/mock/milo',
        googleFolderPetUrl: 'https://drive.google.com/mock/milo',
        date: new Date('2026-08-01T10:30:00.000Z')
    },
    {
        id: '000000000000000000000002',
        userId: '000000000000000000000102',
        userName: 'carlos.lopez',
        productId: '000000000000000000000202',
        productName: 'Latte',
        productImgPublicId: 'coffeeshop/products/latte',
        petId: '000000000000000000000002',
        petName: 'Luna',
        giftReceived: false,
        googlePhotoPetUrl: null,
        googleFolderPetUrl: null,
        date: new Date('2026-08-04T15:20:00.000Z')
    },
    {
        id: '000000000000000000000003',
        userId: '000000000000000000000103',
        userName: 'maria.garcia',
        productId: '000000000000000000000203',
        productName: 'Mocha',
        productImgPublicId: 'coffeeshop/products/mocha',
        petId: '000000000000000000000003',
        petName: 'Max',
        giftReceived: true,
        googlePhotoPetUrl: 'https://photos.google.com/mock/max',
        googleFolderPetUrl: 'https://drive.google.com/mock/max',
        date: new Date('2026-08-07T09:15:00.000Z')
    },
    {
        id: '000000000000000000000004',
        userId: '000000000000000000000104',
        userName: 'jose.ramirez',
        productId: '000000000000000000000204',
        productName: 'Americano',
        productImgPublicId: 'coffeeshop/products/americano',
        petId: '000000000000000000000004',
        petName: 'Rocky',
        giftReceived: false,
        googlePhotoPetUrl: null,
        googleFolderPetUrl: null,
        date: new Date('2026-08-10T13:40:00.000Z')
    },
    {
        id: '000000000000000000000005',
        userId: '000000000000000000000105',
        userName: 'sofia.hernandez',
        productId: '000000000000000000000205',
        productName: 'Cold Brew',
        productImgPublicId: 'coffeeshop/products/cold_brew',
        petId: '000000000000000000000005',
        petName: 'Nala',
        giftReceived: true,
        googlePhotoPetUrl: 'https://photos.google.com/mock/nala',
        googleFolderPetUrl: 'https://drive.google.com/mock/nala',
        date: new Date('2026-08-13T17:10:00.000Z')
    },
    {
        id: '000000000000000000000006',
        userId: '000000000000000000000106',
        userName: 'diego.castillo',
        productId: '000000000000000000000206',
        productName: 'Espresso',
        productImgPublicId: 'coffeeshop/products/espresso',
        petId: '000000000000000000000006',
        petName: 'Toby',
        giftReceived: false,
        googlePhotoPetUrl: null,
        googleFolderPetUrl: null,
        date: new Date('2026-08-16T11:25:00.000Z')
    },
    {
        id: '000000000000000000000007',
        userId: '000000000000000000000107',
        userName: 'laura.mendez',
        productId: '000000000000000000000207',
        productName: 'Caramel Latte',
        productImgPublicId: 'coffeeshop/products/caramel_latte',
        petId: '000000000000000000000007',
        petName: 'Coco',
        giftReceived: true,
        googlePhotoPetUrl: 'https://photos.google.com/mock/coco',
        googleFolderPetUrl: 'https://drive.google.com/mock/coco',
        date: new Date('2026-08-19T14:50:00.000Z')
    },
    {
        id: '000000000000000000000008',
        userId: '000000000000000000000108',
        userName: 'andrea.rodriguez',
        productId: '000000000000000000000208',
        productName: 'Chocolate',
        productImgPublicId: 'coffeeshop/products/chocolate',
        petId: '000000000000000000000008',
        petName: 'Simba',
        giftReceived: false,
        googlePhotoPetUrl: null,
        googleFolderPetUrl: null,
        date: new Date('2026-08-22T08:35:00.000Z')
    },
    {
        id: '000000000000000000000009',
        userId: '000000000000000000000109',
        userName: 'fernando.santos',
        productId: '000000000000000000000209',
        productName: 'Frappé',
        productImgPublicId: 'coffeeshop/products/frappe',
        petId: '000000000000000000000009',
        petName: 'Kira',
        giftReceived: false,
        googlePhotoPetUrl: null,
        googleFolderPetUrl: null,
        date: new Date('2026-08-25T16:45:00.000Z')
    }
]);

// Base de datos simulada para Gift.
// Conserva GiftDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IGiftMockData {
    constructor(items = DEFAULT_GIFT_MOCK_ITEMS) {
        this._items = items.map(item => this._toGiftDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toGiftDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toGiftDetailDto(item));
    }

    _toGiftDetailDto(item) {
        return new GiftDetailDto(item);
    }
}

module.exports = IGiftMockData;
