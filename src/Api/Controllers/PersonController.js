// PersonController.js

// DTOs
const {
    CreatePersonDto,
    UpdatePersonDto
} = require('../../Application/DTOs/PersonDto');

// Controller para manejo de Personas.
class PersonController {
    // Inyección de dependencias a través del constructor.
    constructor(personService) {
        this._personService = personService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todas las personas con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._personService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene una persona por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._personService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea una nueva persona.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreatePersonDto(req.body);
        const result = await this._personService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/person/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza una persona existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdatePersonDto(req.body);
        const result = await this._personService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente una persona.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._personService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = PersonController;
