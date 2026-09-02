const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

const {
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreateProductDto,
    UpdateProductDto,
    ProductListItemDto,
    ProductDetailDto
} = require('../../DTOs/ProductDto');

const IProductMockData = require('../Data/IProductMockData');

// Servicio de Product respaldado por datos simulados.
// Expone el mismo contrato asíncrono que ProductService sin usar
// repositorios ni dependencias de infraestructura.
class ProductMockService {
    constructor(productMockData = new IProductMockData()) {
        this._productMockData = productMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._productMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new ProductListItemDto({
                id: item.id,
                name: item.name,
                imgPublicId: item.imgPublicId,
                price: item.price,
                enabled: item.enabled
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredProduct(id);
    }

    async CreateAsync(createProductDto) {
        const dto = createProductDto instanceof CreateProductDto
            ? createProductDto
            : new CreateProductDto(createProductDto);

        const items = this._productMockData.GetItems();

        const createdProduct = new ProductDetailDto({
            id: this._createId(items),
            name: this._normalizeText(dto.name),
            description: this._normalizeText(dto.description),
            imgPublicId: dto.imgPublicId,
            price: Number(dto.price),
            url: dto.url,
            enabled: true
        });

        this._productMockData.ReplaceItems([
            ...items,
            createdProduct
        ]);

        return new ProductDetailDto(createdProduct);
    }

    async UpdateAsync(id, updateProductDto) {
        const dto = updateProductDto instanceof UpdateProductDto
            ? updateProductDto
            : new UpdateProductDto(updateProductDto);

        const items = this._productMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Producto (${id}) no encontrado.`
            );
        }

        const currentProduct = items[itemIndex];

        const updatedProduct = new ProductDetailDto({
            id: currentProduct.id,

            name: dto.name === undefined
                ? currentProduct.name
                : this._normalizeText(dto.name),

            description: dto.description === undefined
                ? currentProduct.description
                : this._normalizeText(dto.description),

            imgPublicId: dto.imgPublicId === undefined
                ? currentProduct.imgPublicId
                : dto.imgPublicId,

            price: dto.price === undefined
                ? currentProduct.price
                : Number(dto.price),

            url: dto.url === undefined
                ? currentProduct.url
                : dto.url,

            enabled: dto.enabled === undefined
                ? currentProduct.enabled
                : dto.enabled,

            audit: currentProduct.audit
        });

        items[itemIndex] = updatedProduct;

        this._productMockData.ReplaceItems(items);

        return new ProductDetailDto(updatedProduct);
    }

    async SoftDeleteAsync(id) {
        const product = this._getRequiredProduct(id);

        if (product.enabled === false) {
            throw new ConflictError(
                'El Producto ya está inhabilitado.'
            );
        }

        return this._setEnabled(id, false);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);

        this._getRequiredProduct(id);

        return this._setEnabled(id, dto.enabled);
    }

    async HardDeleteAsync(id) {
        const product = this._getRequiredProduct(id);

        const remainingItems = this._productMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._productMockData.ReplaceItems(remainingItems);

        return new ProductDetailDto(product);
    }

    _getRequiredProduct(id) {
        const product = this._productMockData
            .GetItems()
            .find(item => item.id === id);

        if (!product) {
            throw new NotFoundError(
                `Producto (${id}) no encontrado.`
            );
        }

        return new ProductDetailDto(product);
    }

    _setEnabled(id, enabled) {
        const items = this._productMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        const updatedProduct = new ProductDetailDto({
            ...items[itemIndex],
            enabled
        });

        items[itemIndex] = updatedProduct;

        this._productMockData.ReplaceItems(items);

        return new ProductDetailDto(updatedProduct);
    }

    _matchesFilters(product, filters) {
        if (filters.name) {
            const name = String(filters.name)
                .trim()
                .toLowerCase();

            if (
                !String(product.name)
                    .toLowerCase()
                    .includes(name)
            ) {
                return false;
            }
        }

        if (
            filters.enabled !== undefined &&
            filters.enabled !== ''
        ) {
            const enabled =
                filters.enabled === true ||
                filters.enabled === 'true';

            if (product.enabled !== enabled) {
                return false;
            }
        }

        return true;
    }

    _normalizeText(value) {
        return String(value ?? '').trim();
    }

    _createId(items) {
        const lastId = items.reduce(
            (highestId, item) => {
                const numericId =
                    BigInt(`0x${item.id}`);

                return numericId > highestId
                    ? numericId
                    : highestId;
            },
            0n
        );

        return (lastId + 1n)
            .toString(16)
            .padStart(24, '0');
    }
}

module.exports = ProductMockService;