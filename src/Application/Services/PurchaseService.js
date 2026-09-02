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
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const IPurchaseQueries = require('../Interfaces/CQRS/Queries/IPurchaseQueries');

class PurchaseService {
    constructor(purchaseRepository, purchaseQueries, paginationService) {
        this._purchaseRepository = purchaseRepository;
        this._paginationService = paginationService;

        if (!(purchaseQueries instanceof IPurchaseQueries)) {
            throw new Error('purchaseQueries debe implementar IPurchaseQueries');
        }

        this._purchaseQueries = purchaseQueries;

        this._createPurchaseDtoValidator = new CreatePurchaseDtoValidator();
        this._updatePurchaseDtoValidator = new UpdatePurchaseDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._purchaseRepository,
            paginationData,
            purchaseEntity => purchaseEntity,
            searchCriteria,
            purchaseEntities => this._toPurchaseListItemDtosAsync(purchaseEntities)
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

        return await this._toPurchaseDetailDtoAsync(
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
            photoPublicId: null
        });

        const createdPurchaseEntity =
            await this._purchaseRepository.createAsync(purchaseEntity);

        return await this._toPurchaseDetailDtoAsync(createdPurchaseEntity);
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
                : dto.photoPublicId
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

        return await this._toPurchaseDetailDtoAsync(updatedPurchaseEntity);
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

        return await this._toPurchaseDetailDtoAsync(deletedPurchaseEntity);
    }

    async _toPurchaseDetailDtoAsync(purchaseEntity, audit = null) {
        const references = await this._getReferenceMapsAsync([purchaseEntity]);

        return new PurchaseDetailDto({
            id: purchaseEntity.id,
            productId: purchaseEntity.productId,
            productName: references.productNames.get(purchaseEntity.productId) ?? null,
            userId: purchaseEntity.userId,
            userName: references.userNames.get(purchaseEntity.userId) ?? null,
            petId: purchaseEntity.petId,
            petName: references.petNames.get(purchaseEntity.petId) ?? null,
            day: purchaseEntity.day,
            photoPublicId: purchaseEntity.photoPublicId,
            audit
        });
    }

    async _toPurchaseListItemDtosAsync(purchaseEntities) {
        const references = await this._getReferenceMapsAsync(purchaseEntities);

        return purchaseEntities.map(purchaseEntity => new PurchaseListItemDto({
            id: purchaseEntity.id ?? purchaseEntity._id?.toString?.(),
            productName: references.productNames.get(purchaseEntity.productId) ?? null,
            userName: references.userNames.get(purchaseEntity.userId) ?? null,
            petName: references.petNames.get(purchaseEntity.petId) ?? null,
            day: purchaseEntity.day
        }));
    }

    async _getReferenceMapsAsync(purchaseEntities) {
        const result = await this._purchaseQueries
            .getPurchaseReferencesByIdsQueryAsync({
                productIds: purchaseEntities.map(purchase => purchase.productId),
                userIds: purchaseEntities.map(purchase => purchase.userId),
                petIds: purchaseEntities.map(purchase => purchase.petId)
            });

        return {
            productNames: new Map(
                result.products.map(product => [product.productId, product.productName])
            ),
            userNames: new Map(
                result.users.map(user => [user.userId, user.userName])
            ),
            petNames: new Map(
                result.pets.map(pet => [pet.petId, pet.petName])
            )
        };
    }
}

module.exports = PurchaseService;
