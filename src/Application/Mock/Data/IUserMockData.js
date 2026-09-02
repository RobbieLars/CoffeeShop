const { UserDetailDto } = require('../../DTOs/UserDto');

const DEFAULT_USER_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000101',
        photoProfilePublicId: 'coffeeshop/users/ana_martinez',
        username: 'ana.martinez',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000001',
        enabled: true
    },
    {
        id: '000000000000000000000102',
        photoProfilePublicId: 'coffeeshop/users/carlos_lopez',
        username: 'carlos.lopez',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000002',
        enabled: true
    },
    {
        id: '000000000000000000000103',
        photoProfilePublicId: '',
        username: 'maria.garcia',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 1,
        personId: '000000000000000000000003',
        enabled: true
    },
    {
        id: '000000000000000000000104',
        photoProfilePublicId: 'coffeeshop/users/jose_ramirez',
        username: 'jose.ramirez',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000004',
        enabled: true
    },
    {
        id: '000000000000000000000105',
        photoProfilePublicId: '',
        username: 'sofia.hernandez',
        verified: false,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000005',
        enabled: true
    },
    {
        id: '000000000000000000000106',
        photoProfilePublicId: 'coffeeshop/users/diego_castillo',
        username: 'diego.castillo',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000006',
        enabled: true
    },
    {
        id: '000000000000000000000107',
        photoProfilePublicId: '',
        username: 'laura.mendez',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 2,
        personId: '000000000000000000000007',
        enabled: true
    },
    {
        id: '000000000000000000000108',
        photoProfilePublicId: 'coffeeshop/users/andrea_rodriguez',
        username: 'andrea.rodriguez',
        verified: false,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000009',
        enabled: false
    },
    {
        id: '000000000000000000000109',
        photoProfilePublicId: '',
        username: 'fernando.santos',
        verified: true,
        lockedUntil: null,
        failedLoginAttempts: 0,
        personId: '000000000000000000000008',
        enabled: false
    }
]);

// Base de datos simulada para User.
// Conserva UserDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IUserMockData {
    constructor(items = DEFAULT_USER_MOCK_ITEMS) {
        this._items = items.map(item => this._toUserDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toUserDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toUserDetailDto(item));
    }

    _toUserDetailDto(item) {
        return new UserDetailDto(item);
    }
}

module.exports = IUserMockData;