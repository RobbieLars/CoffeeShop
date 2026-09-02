const { RoleDetailDto } = require('../../DTOs/RoleDto');

const DEFAULT_ROLE_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        name: 'Administrator',
        description: 'Role de administración general.',
        enabled: true
    },
    {
        id: '000000000000000000000002',
        name: 'Manager',
        description: 'Role de gestión operativa.',
        enabled: true
    },
    {
        id: '000000000000000000000003',
        name: 'Cashier',
        description: 'Role para operaciones de caja.',
        enabled: true
    },
    {
        id: '000000000000000000000004',
        name: 'Barista',
        description: 'Role para preparación y entrega de productos.',
        enabled: true
    },
    {
        id: '000000000000000000000005',
        name: 'Inventory',
        description: 'Role para administración de inventario.',
        enabled: true
    },
    {
        id: '000000000000000000000006',
        name: 'Customer',
        description: 'Role para clientes de CoffeeShop.',
        enabled: true
    },
    {
        id: '000000000000000000000007',
        name: 'Auditor',
        description: 'Role de auditoría actualmente inhabilitado.',
        enabled: false
    },
    {
        id: '000000000000000000000008',
        name: 'Supplier',
        description: 'Role para proveedores actualmente inhabilitado.',
        enabled: false
    },
    {
        id: '000000000000000000000009',
        name: 'Guest',
        description: 'Role de acceso temporal actualmente inhabilitado.',
        enabled: false
    }
]);

// Base de datos simulada para Role.
// Conserva RoleDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IRoleMockData {
    constructor(items = DEFAULT_ROLE_MOCK_ITEMS) {
        this._items = items.map(item => this._toRoleDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toRoleDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toRoleDetailDto(item));
    }

    _toRoleDetailDto(item) {
        return new RoleDetailDto(item);
    }
}

module.exports = IRoleMockData;
