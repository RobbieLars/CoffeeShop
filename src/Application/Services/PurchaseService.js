// PurchaseService.js

const {
    PurchaseListItemDto,
    PurchaseDetailDto,
    CreatePurchaseDto,
    UpdatePurchaseDto
} = require('../DTOs/PurchaseDto');

const Purchase = require('../../Domain/Entities/Purchase');

const {
    CreatePurchaseDtoValidator,
    UpdatePurchaseDtoValidator
} = require('../Validators/Service/PurchaseDtoValidator');

const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const {
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

const {
    ValidationError,
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class PurchaseService {
    constructor(purchaseRepository, paginationService) {
        this._purchaseRepository = purchaseRepository;
        this._paginationService = paginationService;

        this._createPurchaseDtoValidator = new CreatePurchaseDtoValidator();
        this._updatePurchaseDtoValidator = new UpdatePurchaseDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._purchaseRepository,
            paginationData,
            purchaseEntity => this._toPurchaseListItemDto(purchaseEntity),
            searchCriteria
        );
    }

    async GetByIdAsync(id) {
        const purchaseId = validateRequiredObjectId(id, 'id');

        const purchaseEntity =
            await this._purchaseRepository.getByIdWithAuditAsync(purchaseId);

        if (!purchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        return this._toPurchaseDetailDto(
            purchaseEntity.entity,
            purchaseEntity.audit
        );
    }

    async CreateAsync(createPurchaseDto) {
        const dto = createPurchaseDto instanceof CreatePurchaseDto
            ? createPurchaseDto
            : new CreatePurchaseDto(createPurchaseDto);

        const validationErrors =
            this._createPurchaseDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const purchaseEntity = new Purchase({
            productId: dto.productId,
            userId: dto.userId,
            petId: dto.petId,
            day: new Date(),
            photoPublicId: null,
            enabled: true
        });

        const createdPurchaseEntity =
            await this._purchaseRepository.createAsync(purchaseEntity);

        return this._toPurchaseDetailDto(createdPurchaseEntity);
    }

    async UpdateAsync(id, updatePurchaseDto) {
        const purchaseId = validateRequiredObjectId(id, 'id');

        const dto = updatePurchaseDto instanceof UpdatePurchaseDto
            ? updatePurchaseDto
            : new UpdatePurchaseDto(updatePurchaseDto);

        const validationErrors =
            this._updatePurchaseDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingPurchaseEntity =
            await this._purchaseRepository.getByIdAsync(purchaseId);

        if (!existingPurchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        const purchaseEntity = new Purchase({
            id: purchaseId,

            productId: resolveUpdateValue(
                dto.productId,
                existingPurchaseEntity.productId
            ),

            userId: resolveUpdateValue(
                dto.userId,
                existingPurchaseEntity.userId
            ),

            petId: resolveUpdateValue(
                dto.petId,
                existingPurchaseEntity.petId
            ),

            day: resolveUpdateValue(
                dto.day,
                existingPurchaseEntity.day
            ),

            photoPublicId: dto.photoPublicId === undefined
                ? existingPurchaseEntity.photoPublicId
                : dto.photoPublicId,

            enabled: resolveUpdateValue(
                dto.enabled,
                existingPurchaseEntity.enabled
            )
        });

        const updatedPurchaseEntity =
            await this._purchaseRepository.updateByIdAsync(
                purchaseId,
                purchaseEntity
            );

        if (!updatedPurchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        return this._toPurchaseDetailDto(updatedPurchaseEntity);
    }

    async SoftDeleteAsync(id) {
        const purchaseId = validateRequiredObjectId(id, 'id');
        const existingPurchaseEntity =
            await this._purchaseRepository.getByIdAsync(purchaseId);

        if (!existingPurchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        if (existingPurchaseEntity.enabled === false) {
            throw new ConflictError('La Compra ya está inhabilitada.');
        }

        const disabledPurchaseEntity =
            await this._purchaseRepository.patchByIdAsync(
                purchaseId,
                { enabled: false }
            );

        if (!disabledPurchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        return this._toPurchaseDetailDto(disabledPurchaseEntity);
    }

    async HardDeleteAsync(id) {
        const purchaseId = validateRequiredObjectId(id, 'id');

        const deletedPurchaseEntity =
            await this._purchaseRepository.deleteByIdAsync(purchaseId);

        if (!deletedPurchaseEntity) {
            throw new NotFoundError(
                `Compra (${purchaseId}) no encontrada.`
            );
        }

        return this._toPurchaseDetailDto(deletedPurchaseEntity);
    }

    _toPurchaseDetailDto(purchaseEntity, audit = null) {
        return new PurchaseDetailDto({
            id: purchaseEntity.id,
            productId: purchaseEntity.productId,
            userId: purchaseEntity.userId,
            petId: purchaseEntity.petId,
            day: purchaseEntity.day,
            photoPublicId: purchaseEntity.photoPublicId,
            enabled: purchaseEntity.enabled,
            audit
        });
    }

    _toPurchaseListItemDto(purchaseEntity) {
        return new PurchaseListItemDto({
            id: purchaseEntity.id ?? purchaseEntity._id,
            productId: purchaseEntity.productId,
            userId: purchaseEntity.userId,
            petId: purchaseEntity.petId,
            day: purchaseEntity.day,
            enabled: purchaseEntity.enabled
        });
    }
}

module.exports = PurchaseService;
