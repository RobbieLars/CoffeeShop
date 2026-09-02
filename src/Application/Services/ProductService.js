// ProductService.js

const {
    ProductListItemDto,
    ProductDetailDto,
    CreateProductDto,
    UpdateProductDto
} = require('../DTOs/ProductDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

const Product = require('../../Domain/Entities/Product');

const {
    CreateProductDtoValidator,
    UpdateProductDtoValidator
} = require('../Validators/Service/ProductDtoValidator');
const CommonEnabledDtoValidator =
    require('../Validators/Service/Common/CommonEnabledDtoValidator');

const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

const {
    ValidationError,
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class ProductService {

    constructor(productRepository, paginationService) {
        this._productRepository = productRepository;
        this._paginationService = paginationService;

        this._createProductDtoValidator =
            new CreateProductDtoValidator();

        this._updateProductDtoValidator =
            new UpdateProductDtoValidator();

        this._commonEnabledDtoValidator =
            new CommonEnabledDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._productRepository,
            paginationData,
            productEntity => this._toProductListItemDto(productEntity),
            searchCriteria
        );
    }

    async GetByIdAsync(id) {
        const productId = validateRequiredObjectId(id, 'id');

        const productEntity =
            await this._productRepository.getByIdWithAuditAsync(productId);

        if (!productEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        return this._toProductDetailDto(
            productEntity.entity,
            productEntity.audit
        );
    }

    async CreateAsync(createProductDto) {
        const dto = createProductDto instanceof CreateProductDto
            ? createProductDto
            : new CreateProductDto(createProductDto);

        const validationErrors =
            this._createProductDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const productEntity = new Product({
            name: normalizeText(dto.name),
            description: normalizeText(dto.description),
            imgPublicId: dto.imgPublicId,
            price: Number(dto.price),
            url: dto.url,
            enabled: true
        });

        const createdProductEntity =
            await this._productRepository.createAsync(productEntity);

        return this._toProductDetailDto(createdProductEntity);
    }

    async UpdateAsync(id, updateProductDto) {
        const productId = validateRequiredObjectId(id, 'id');

        const dto = updateProductDto instanceof UpdateProductDto
            ? updateProductDto
            : new UpdateProductDto(updateProductDto);

        const validationErrors =
            this._updateProductDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingProductEntity =
            await this._productRepository.getByIdAsync(productId);

        if (!existingProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        const productEntity = new Product({
            id: productId,

            name: resolveUpdateValue(
                dto.name,
                existingProductEntity.name,
                normalizeText
            ),

            description: resolveUpdateValue(
                dto.description,
                existingProductEntity.description,
                normalizeText
            ),

            imgPublicId: resolveUpdateValue(
                dto.imgPublicId,
                existingProductEntity.imgPublicId
            ),

            price: resolveUpdateValue(
                dto.price,
                existingProductEntity.price,
                Number
            ),

            url: resolveUpdateValue(
                dto.url,
                existingProductEntity.url
            ),

            enabled: resolveUpdateValue(
                dto.enabled,
                existingProductEntity.enabled
            )
        });

        const updatedProductEntity =
            await this._productRepository.updateByIdAsync(
                productId,
                productEntity
            );

        if (!updatedProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        return this._toProductDetailDto(updatedProductEntity);
    }

    async SoftDeleteAsync(id) {
        const productId = validateRequiredObjectId(id, 'id');

        const existingProductEntity =
            await this._productRepository.getByIdAsync(productId);

        if (!existingProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        if (existingProductEntity.enabled === false) {
            throw new ConflictError(
                'El Producto ya está inhabilitado.'
            );
        }

        const updatedProductEntity =
            await this._productRepository.patchByIdAsync(
                productId,
                { enabled: false }
            );

        if (!updatedProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        return this._toProductDetailDto(updatedProductEntity);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const productId = validateRequiredObjectId(id, 'id');

        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);

        const validationErrors =
            this._commonEnabledDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingProductEntity =
            await this._productRepository.getByIdAsync(productId);

        if (!existingProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        const updatedProductEntity =
            await this._productRepository.patchByIdAsync(
                productId,
                { enabled: dto.enabled }
            );

        if (!updatedProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        return this._toProductDetailDto(updatedProductEntity);
    }

    async HardDeleteAsync(id) {
        const productId = validateRequiredObjectId(id, 'id');

        const deletedProductEntity =
            await this._productRepository.deleteByIdAsync(productId);

        if (!deletedProductEntity) {
            throw new NotFoundError(
                `Producto (${productId}) no encontrado.`
            );
        }

        return this._toProductDetailDto(deletedProductEntity);
    }

    _toProductDetailDto(productEntity, audit = null) {
        return new ProductDetailDto({
            id: productEntity.id,
            name: productEntity.name,
            description: productEntity.description,
            imgPublicId: productEntity.imgPublicId,
            price: productEntity.price,
            url: productEntity.url,
            enabled: productEntity.enabled,
            audit
        });
    }

    _toProductListItemDto(productEntity) {
        return new ProductListItemDto({
            id: productEntity.id ?? productEntity._id,
            name: productEntity.name,
            imgPublicId: productEntity.imgPublicId,
            price: productEntity.price,
            enabled: productEntity.enabled
        });
    }
}

module.exports = ProductService;
