// PaginationDto.js
// DTO común para solicitudes de paginación.

// Por defecto se establece :
// 1 pagina con 5 items por pagina.

// Pueden ser sobreescritos por el cliente a través de query params, por ejemplo:
// [ GET ] /api/ruta?page=2&pageSize=10

class PaginationDto {
    constructor({ page = 1, pageSize = 5 } = {}) {
        this.page = Number(page) || 1;
        this.pageSize = Number(pageSize) || 5;
    }
}

module.exports = PaginationDto;