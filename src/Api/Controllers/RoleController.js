// RoleController.js

// DTOs
const {
    CreateRoleDto,
    UpdateRoleDto
} = require('../../Application/DTOs/RoleDto');

// Controller para manejo de Roles.
class RoleController {
    // Inyección de dependencias a través del constructor.
    constructor(roleService) {
        this._roleService = roleService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.SoftDeleteAsync = this.SoftDeleteAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todos los roles con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._roleService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene un rol por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._roleService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea un nuevo rol.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreateRoleDto(req.body);
        const result = await this._roleService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/role/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza un rol existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdateRoleDto(req.body);
        const result = await this._roleService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync: Inhabilita lógicamente un rol.
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(req, res) {
        await this._roleService.SoftDeleteAsync(req.params.id);
        return res.status(204).send();
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente un rol.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._roleService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = RoleController;
