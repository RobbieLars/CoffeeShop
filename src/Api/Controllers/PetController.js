// PetController.js

// DTOs
const {
    CreatePetDto,
    UpdatePetDto
} = require('../../Application/DTOs/PetDto');

// Controller para manejo de Mascotas.
class PetController {
    constructor(petService) {
        this._petService = petService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.SoftDeleteAsync = this.SoftDeleteAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todas las mascotas con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._petService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene una mascota por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._petService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea una nueva mascota.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreatePetDto(req.body);
        const result = await this._petService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/pet/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza una mascota existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdatePetDto(req.body);
        const result = await this._petService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync: Inhabilita lógicamente una mascota.
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(req, res) {
        await this._petService.SoftDeleteAsync(req.params.id);
        return res.status(204).send();
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente una mascota.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._petService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = PetController;
