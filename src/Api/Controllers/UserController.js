// UserController.js

// DTOs
const {
    CreateUserDto,
    UpdateUserDto
} = require('../../Application/DTOs/UserDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

// Controller para manejo de Usuarios.
class UserController {
    // Inyección de dependencias a través del constructor.
    constructor(userService) {
        this._userService = userService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.PatchEnabledAsync = this.PatchEnabledAsync.bind(this);
        this.SoftDeleteAsync = this.SoftDeleteAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todos los usuarios con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._userService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene un usuario por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._userService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea un nuevo usuario.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreateUserDto(req.body);
        const result = await this._userService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/user/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza un usuario existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdateUserDto(req.body);
        const result = await this._userService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    async PatchEnabledAsync(req, res) {
        const dto = new CommonEnabledDto(req.body);
        const result = await this._userService.PatchEnabledAsync(
            req.params.id,
            dto
        );

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync: Inhabilita lógicamente un usuario.
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(req, res) {
        await this._userService.SoftDeleteAsync(req.params.id);
        return res.status(204).send();
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente un usuario.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._userService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = UserController;
