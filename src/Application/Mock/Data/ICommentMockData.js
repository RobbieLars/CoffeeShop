const { CommentDetailDto } = require('../../DTOs/CommentDto');

const DEFAULT_COMMENT_MOCK_ITEMS = Object.freeze([
    {
        id: '000000000000000000000001',
        userId: '000000000000000000000101',
        userUsername: 'ana.martinez',
        userPhotoProfilePublicId: 'coffeeshop/users/ana_martinez',
        subject: 'Atención y café',
        message: 'Excelente atención y muy buen café.',
        photoPublicId: null,
        edited: false
    },
    {
        id: '000000000000000000000002',
        userId: '000000000000000000000102',
        userUsername: 'carlos.lopez',
        userPhotoProfilePublicId: 'coffeeshop/users/carlos_lopez',
        subject: 'Ambiente',
        message: 'El ambiente del lugar es bastante agradable.',
        photoPublicId: 'coffeeshop/comments/comment_002',
        edited: false
    },
    {
        id: '000000000000000000000003',
        userId: '000000000000000000000103',
        userUsername: 'maria.garcia',
        userPhotoProfilePublicId: '',
        subject: 'Variedad de bebidas',
        message: 'Me gustó mucho la variedad de bebidas disponibles.',
        photoPublicId: null,
        edited: true
    },
    {
        id: '000000000000000000000004',
        userId: '000000000000000000000104',
        userUsername: 'jose.ramirez',
        userPhotoProfilePublicId: 'coffeeshop/users/jose_ramirez',
        subject: 'Servicio',
        message: 'La atención fue rápida y amable.',
        photoPublicId: null,
        edited: false
    },
    {
        id: '000000000000000000000005',
        userId: '000000000000000000000105',
        userUsername: 'sofia.hernandez',
        userPhotoProfilePublicId: '',
        subject: 'Calidad del café',
        message: 'El café estaba muy bueno, definitivamente volvería.',
        photoPublicId: 'coffeeshop/comments/comment_005',
        edited: true
    },
    {
        id: '000000000000000000000006',
        userId: '000000000000000000000106',
        userUsername: 'diego.castillo',
        userPhotoProfilePublicId: 'coffeeshop/users/diego_castillo',
        subject: 'Espacio de trabajo',
        message: 'Buen lugar para sentarse a trabajar un rato.',
        photoPublicId: null,
        edited: false
    },
    {
        id: '000000000000000000000007',
        userId: '000000000000000000000107',
        userUsername: 'laura.mendez',
        userPhotoProfilePublicId: '',
        subject: 'Presentación',
        message: 'La presentación de las bebidas me pareció excelente.',
        photoPublicId: 'coffeeshop/comments/comment_007',
        edited: false
    },
    {
        id: '000000000000000000000008',
        userId: '000000000000000000000108',
        userUsername: 'andrea.rodriguez',
        userPhotoProfilePublicId: 'coffeeshop/users/andrea_rodriguez',
        subject: 'Experiencia general',
        message: 'Muy buena experiencia en general.',
        photoPublicId: null,
        edited: true
    },
    {
        id: '000000000000000000000009',
        userId: '000000000000000000000109',
        userUsername: 'fernando.santos',
        userPhotoProfilePublicId: '',
        subject: 'Opciones de postres',
        message: 'Me gustaría que hubiera más opciones de postres.',
        photoPublicId: null,
        edited: false
    }
]);

// Base de datos simulada para Comment.
// Conserva CommentDetailDto como representación completa y permite que los
// servicios mock proyecten otros DTOs según la operación solicitada.
class ICommentMockData {
    constructor(items = DEFAULT_COMMENT_MOCK_ITEMS) {
        this._items = items.map(item => this._toCommentDetailDto(item));
    }

    GetItems() {
        return this._items.map(item => this._toCommentDetailDto(item));
    }

    ReplaceItems(items = []) {
        this._items = items.map(item => this._toCommentDetailDto(item));
    }

    _toCommentDetailDto(item) {
        return new CommentDetailDto(item);
    }
}

module.exports = ICommentMockData;
