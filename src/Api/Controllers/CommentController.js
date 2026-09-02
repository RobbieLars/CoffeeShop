// CommentController.js

// DTOs
const {
    CreateCommentDto,
    UpdateCommentDto,
    PatchCommentMessageDto
} = require('../../Application/DTOs/CommentDto');

// Controller para manejo de Comentarios.
class CommentController {
    // Inyección de dependencias a través del constructor.
    constructor(commentService) {
        this._commentService = commentService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.PatchMessageAsync = this.PatchMessageAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todos los comentarios con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._commentService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene un comentario por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._commentService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea un nuevo comentario.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreateCommentDto(req.body);
        const result = await this._commentService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/comment/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza un comentario existente (marca edited en true).
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdateCommentDto(req.body);
        const result = await this._commentService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // PatchMessageAsync: Actualiza únicamente el texto del mensaje (marca edited en true).
    // -----------------------------------------------------------------------------
    async PatchMessageAsync(req, res) {
        const dto = new PatchCommentMessageDto(req.body);
        const result = await this._commentService.PatchMessageAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente un comentario.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._commentService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = CommentController;
