// PurchaseController.js

// DTOs
const {
    CreatePurchaseDto,
    UpdatePurchaseDto
} = require('../../Application/DTOs/PurchaseDto');

// Controller para manejo de Compras.
class PurchaseController {
    // Inyección de dependencias a través del constructor.
    constructor(purchaseService) {
        this._purchaseService = purchaseService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todas las compras con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._purchaseService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene una compra por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._purchaseService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea una nueva compra.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreatePurchaseDto(req.body);
        const result = await this._purchaseService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/purchase/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza una compra existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdatePurchaseDto(req.body);
        const result = await this._purchaseService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente una compra.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._purchaseService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = PurchaseController;
