// ProductController.js

// DTOs
const {
    CreateProductDto,
    UpdateProductDto
} = require('../../Application/DTOs/ProductDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

// Controller para manejo de Productos.
class ProductController {
    // Inyección de dependencias a través del constructor.
    constructor(productService) {
        this._productService = productService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.PatchEnabledAsync = this.PatchEnabledAsync.bind(this);
        this.SoftDeleteAsync = this.SoftDeleteAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todos los productos con paginación y filtros.
    // -----------------------------------------------------------------------------
    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;

        const result = await this._productService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene un producto por su ID.
    // -----------------------------------------------------------------------------
    async GetByIdAsync(req, res) {
        const result = await this._productService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea un nuevo producto.
    // -----------------------------------------------------------------------------
    async CreateAsync(req, res) {
        const dto = new CreateProductDto(req.body);
        const result = await this._productService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/product/${result.id}`)
            .json(result);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza un producto existente.
    // -----------------------------------------------------------------------------
    async UpdateAsync(req, res) {
        const dto = new UpdateProductDto(req.body);
        const result = await this._productService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // PatchEnabledAsync: Actualiza únicamente el estado de un producto.
    // -----------------------------------------------------------------------------
    async PatchEnabledAsync(req, res) {
        const dto = new CommonEnabledDto(req.body);
        const result = await this._productService.PatchEnabledAsync(
            req.params.id,
            dto
        );

        return res.status(200).json(result);
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync: Inhabilita lógicamente un producto.
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(req, res) {
        await this._productService.SoftDeleteAsync(req.params.id);
        return res.status(204).send();
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente un producto.
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(req, res) {
        await this._productService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = ProductController;
