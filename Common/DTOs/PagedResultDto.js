// PagedResultDto.js
// DTO común para devolver resultados paginados.

class PagedResultDto {
    constructor({ items, page, pageSize, totalItems }) {
        this.items = items;
        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / pageSize);
    }
}

module.exports = PagedResultDto;