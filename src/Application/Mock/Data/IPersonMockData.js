const { PersonDetailDto } = require('../../DTOs/PersonDto');

const DEFAULT_PERSON_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        name: 'Ana',
        secondName: 'María',
        lastName: 'Martínez',
        secondLastName: 'López',
        birthDate: new Date('1995-04-12T00:00:00.000Z'),
        gender: 'Female',
        userId: '000000000000000000000101',
        userName: 'ana.martinez',
        email: 'ana.martinez@example.com',
        googleFolderPersonUrl: 'https://drive.google.com/mock/ana-martinez'
    },
    {
        id: '000000000000000000000002',
        name: 'Carlos',
        secondName: 'Alberto',
        lastName: 'López',
        secondLastName: 'García',
        birthDate: new Date('1992-08-23T00:00:00.000Z'),
        gender: 'Male',
        userId: '000000000000000000000102',
        userName: 'carlos.lopez',
        email: 'carlos.lopez@example.com',
        googleFolderPersonUrl: 'https://drive.google.com/mock/carlos-lopez'
    },
    {
        id: '000000000000000000000003',
        name: 'María',
        secondName: '',
        lastName: 'García',
        secondLastName: 'Hernández',
        birthDate: new Date('1998-01-17T00:00:00.000Z'),
        gender: 'Female',
        userId: '000000000000000000000103',
        userName: 'maria.garcia',
        email: 'maria.garcia@example.com',
        googleFolderPersonUrl: null
    },
    {
        id: '000000000000000000000004',
        name: 'José',
        secondName: 'Antonio',
        lastName: 'Ramírez',
        secondLastName: 'Castillo',
        birthDate: new Date('1989-11-05T00:00:00.000Z'),
        gender: 'Male',
        userId: '000000000000000000000104',
        userName: 'jose.ramirez',
        email: 'jose.ramirez@example.com',
        googleFolderPersonUrl: 'https://drive.google.com/mock/jose-ramirez'
    },
    {
        id: '000000000000000000000005',
        name: 'Sofía',
        secondName: 'Elena',
        lastName: 'Hernández',
        secondLastName: 'Méndez',
        birthDate: new Date('2000-06-28T00:00:00.000Z'),
        gender: 'Female',
        userId: '000000000000000000000105',
        userName: 'sofia.hernandez',
        email: 'sofia.hernandez@example.com',
        googleFolderPersonUrl: null
    },
    {
        id: '000000000000000000000006',
        name: 'Diego',
        secondName: '',
        lastName: 'Castillo',
        secondLastName: 'Flores',
        birthDate: new Date('1996-02-14T00:00:00.000Z'),
        gender: 'Male',
        userId: '000000000000000000000106',
        userName: 'diego.castillo',
        email: 'diego.castillo@example.com',
        googleFolderPersonUrl: 'https://drive.google.com/mock/diego-castillo'
    },
    {
        id: '000000000000000000000007',
        name: 'Laura',
        secondName: 'Isabel',
        lastName: 'Méndez',
        secondLastName: 'Santos',
        birthDate: new Date('1994-09-09T00:00:00.000Z'),
        gender: 'Female',
        userId: '000000000000000000000107',
        userName: 'laura.mendez',
        email: 'laura.mendez@example.com',
        googleFolderPersonUrl: null
    },
    {
        id: '000000000000000000000008',
        name: 'Fernando',
        secondName: 'Javier',
        lastName: 'Santos',
        secondLastName: 'Rodríguez',
        birthDate: new Date('1991-12-19T00:00:00.000Z'),
        gender: 'Male',
        userId: '000000000000000000000109',
        userName: 'fernando.santos',
        email: 'fernando.santos@example.com',
        googleFolderPersonUrl: null
    },
    {
        id: '000000000000000000000009',
        name: 'Andrea',
        secondName: '',
        lastName: 'Rodríguez',
        secondLastName: 'Pérez',
        birthDate: null,
        gender: null,
        userId: '000000000000000000000108',
        userName: 'andrea.rodriguez',
        email: null,
        googleFolderPersonUrl: null
    }
]);

// Base de datos simulada para Person.
// Conserva PersonDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class IPersonMockData {
    constructor(items = DEFAULT_PERSON_MOCK_ITEMS) {
        this._items = items.map(item => this._toPersonDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toPersonDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toPersonDetailDto(item));
    }

    _toPersonDetailDto(item) {
        return new PersonDetailDto(item);
    }
}

module.exports = IPersonMockData;
