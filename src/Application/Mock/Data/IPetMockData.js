const { PetDetailDto } = require('../../DTOs/PetDto');
const PetType = require('../../../Domain/Constants/PetType');

const DEFAULT_PET_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        ownerId: '000000000000000000000101',
        ownerName: 'ana.martinez',
        photoPublicId: 'coffeeshop/pets/milo',
        name: 'Milo',
        type: 1,
        birthDate: new Date('2021-04-12T00:00:00.000Z'),
        gender: 1,
        weight: 12.5,
        favoriteFood: 'Pollo',
        privacy: true
    },
    {
        id: '000000000000000000000002',
        ownerId: '000000000000000000000102',
        ownerName: 'carlos.lopez',
        photoPublicId: 'coffeeshop/pets/luna',
        name: 'Luna',
        type: 2,
        birthDate: new Date('2022-07-08T00:00:00.000Z'),
        gender: 2,
        weight: 4.8,
        favoriteFood: 'Atún',
        privacy: true
    },
    {
        id: '000000000000000000000003',
        ownerId: '000000000000000000000103',
        ownerName: 'maria.garcia',
        photoPublicId: null,
        name: 'Max',
        type: 1,
        birthDate: new Date('2020-01-19T00:00:00.000Z'),
        gender: 1,
        weight: 18.2,
        favoriteFood: 'Carne',
        privacy: false
    },
    {
        id: '000000000000000000000004',
        ownerId: '000000000000000000000104',
        ownerName: 'jose.ramirez',
        photoPublicId: 'coffeeshop/pets/rocky',
        name: 'Rocky',
        type: 1,
        birthDate: new Date('2019-10-03T00:00:00.000Z'),
        gender: 1,
        weight: 22.7,
        favoriteFood: null,
        privacy: true
    },
    {
        id: '000000000000000000000005',
        ownerId: '000000000000000000000105',
        ownerName: 'sofia.hernandez',
        photoPublicId: 'coffeeshop/pets/nala',
        name: 'Nala',
        type: 2,
        birthDate: new Date('2023-02-15T00:00:00.000Z'),
        gender: 2,
        weight: 3.9,
        favoriteFood: 'Pescado',
        privacy: true
    },
    {
        id: '000000000000000000000006',
        ownerId: '000000000000000000000106',
        ownerName: 'diego.castillo',
        photoPublicId: null,
        name: 'Toby',
        type: 1,
        birthDate: null,
        gender: 1,
        weight: 9.4,
        favoriteFood: 'Pollo',
        privacy: false
    },
    {
        id: '000000000000000000000007',
        ownerId: '000000000000000000000107',
        ownerName: 'laura.mendez',
        photoPublicId: 'coffeeshop/pets/coco',
        name: 'Coco',
        type: 2,
        birthDate: new Date('2021-12-09T00:00:00.000Z'),
        gender: 2,
        weight: 5.1,
        favoriteFood: null,
        privacy: true
    },
    {
        id: '000000000000000000000008',
        ownerId: '000000000000000000000109',
        ownerName: 'fernando.santos',
        photoPublicId: 'coffeeshop/pets/simba',
        name: 'Simba',
        type: 2,
        birthDate: new Date('2020-06-22T00:00:00.000Z'),
        gender: 1,
        weight: 6.3,
        favoriteFood: 'Atún',
        privacy: true
    },
    {
        id: '000000000000000000000009',
        ownerId: '000000000000000000000108',
        ownerName: 'andrea.rodriguez',
        photoPublicId: null,
        name: 'Kira',
        type: 1,
        birthDate: new Date('2022-09-30T00:00:00.000Z'),
        gender: 2,
        weight: 14.6,
        favoriteFood: 'Carne',
        privacy: false
    }
]);

// Base de datos simulada para Pet.
// Conserva PetDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IPetMockData {
    constructor(items = DEFAULT_PET_MOCK_ITEMS) {
        this._items = items.map(item => this._toPetDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toPetDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toPetDetailDto(item));
    }

    _toPetDetailDto(item) {
        const typeName = Object.entries(PetType)
            .find(([, value]) => value === Number(item.type))?.[0] ?? null;

        return new PetDetailDto({
            ...item,
            typeName
        });
    }
}

module.exports = IPetMockData;
