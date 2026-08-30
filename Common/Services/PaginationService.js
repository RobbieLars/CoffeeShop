// PaginationService.js

const PaginationDto = require('../DTOs/PaginationDto');
const PagedResultDto = require('../DTOs/PagedResultDto');
const PaginationValidator = require('../Validators/PaginationValidator');

// Error personalizado para validación
const { ValidationError } = require('../Errors/ApplicationErrors');

// PaginationService para manejar la lógica de paginación en los servicios
class PaginationService {
    // El constructor inicializa el validador de paginación
    constructor() {
        this._paginationValidator = new PaginationValidator();
    }

    // Método para paginar resultados de un repositorio
    async paginate(
        repository,
        paginationData,
        mapItem,
        searchCriteria = {},
        mapItems = null
    ) {
        const paginationDto = new PaginationDto(paginationData);
        const validationErrors = this._paginationValidator.validate(paginationDto);

        // Si hay errores de validación, se lanza una excepción con los detalles
        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        // Se obtiene el resultado paginado del repositorio
        const pagedResult = await repository.getPagedAsync(
            paginationDto.page,
            paginationDto.pageSize,
            searchCriteria
        );

        const items = typeof mapItems === 'function'
            ? await mapItems(pagedResult.items)
            : await Promise.all(
                pagedResult.items.map(item => mapItem(item))
            );

        // Se mapea cada elemento del resultado paginado utilizando la función mapItem
        return new PagedResultDto({
            items,
            page: paginationDto.page,
            pageSize: paginationDto.pageSize,
            totalItems: pagedResult.totalItems
        });
    }
}

module.exports = PaginationService;
