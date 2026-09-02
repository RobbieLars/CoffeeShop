const {
    GiftListItemDto,
    GiftDetailDto,
    CreateGiftDto,
    UpdateGiftDto,
    PatchGiftReceivedDto
} = require('../DTOs/GiftDto');
const Gift = require('../../Domain/Entities/Gift');
const {
    CreateGiftDtoValidator,
    UpdateGiftDtoValidator,
    PatchGiftReceivedDtoValidator
} = require('../Validators/Service/GiftDtoValidator');
const IGiftQueries = require('../Interfaces/CQRS/Queries/IGiftQueries');
const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');
const {
    ValidationError,
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class GiftService {
    constructor(giftRepository, giftQueries, paginationService) {
        this._giftRepository = giftRepository;
        this._paginationService = paginationService;

        if (!(giftQueries instanceof IGiftQueries)) {
            throw new Error('giftQueries debe implementar IGiftQueries');
        }

        this._giftQueries = giftQueries;
        this._createGiftDtoValidator = new CreateGiftDtoValidator();
        this._updateGiftDtoValidator = new UpdateGiftDtoValidator();
        this._patchGiftReceivedDtoValidator =
            new PatchGiftReceivedDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._giftRepository,
            paginationData,
            giftEntity => giftEntity,
            searchCriteria,
            giftEntities => this._toGiftListItemDtosAsync(giftEntities)
        );
    }

    async GetByIdAsync(id) {
        const giftId = validateRequiredObjectId(id, 'id');
        const result = await this._giftRepository.getByIdWithAuditAsync(giftId);

        if (!result) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        return await this._toGiftDetailDtoAsync(result.entity, result.audit);
    }

    async CreateAsync(createGiftDto) {
        const dto = createGiftDto instanceof CreateGiftDto
            ? createGiftDto
            : new CreateGiftDto(createGiftDto);
        const validationErrors = this._createGiftDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const giftEntity = new Gift({
            userId: dto.userId,
            productId: dto.productId,
            petId: dto.petId,
            date: new Date(),
            giftReceived: false,
            googlePhotoPetUrl: null,
            googleFolderPetUrl: null
        });
        const createdGift = await this._giftRepository.createAsync(giftEntity);

        return await this._toGiftDetailDtoAsync(createdGift);
    }

    async UpdateAsync(id, updateGiftDto) {
        const giftId = validateRequiredObjectId(id, 'id');
        const dto = updateGiftDto instanceof UpdateGiftDto
            ? updateGiftDto
            : new UpdateGiftDto(updateGiftDto);
        const validationErrors = this._updateGiftDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingGift = await this._giftRepository.getByIdAsync(giftId);

        if (!existingGift) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        const giftEntity = new Gift({
            id: giftId,
            userId: resolveUpdateValue(dto.userId, existingGift.userId),
            productId: resolveUpdateValue(dto.productId, existingGift.productId),
            petId: resolveUpdateValue(dto.petId, existingGift.petId),
            date: resolveUpdateValue(dto.date, existingGift.date, value => new Date(value)),
            giftReceived: resolveUpdateValue(
                dto.giftReceived,
                existingGift.giftReceived
            ),
            googlePhotoPetUrl: this._resolveNullableUrl(
                dto.googlePhotoPetUrl,
                existingGift.googlePhotoPetUrl
            ),
            googleFolderPetUrl: this._resolveNullableUrl(
                dto.googleFolderPetUrl,
                existingGift.googleFolderPetUrl
            )
        });
        const updatedGift = await this._giftRepository.updateByIdAsync(
            giftId,
            giftEntity
        );

        if (!updatedGift) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        return await this._toGiftDetailDtoAsync(updatedGift);
    }

    async PatchReceivedAsync(id, patchGiftReceivedDto) {
        const giftId = validateRequiredObjectId(id, 'id');
        const dto = patchGiftReceivedDto instanceof PatchGiftReceivedDto
            ? patchGiftReceivedDto
            : new PatchGiftReceivedDto(patchGiftReceivedDto);
        const validationErrors =
            this._patchGiftReceivedDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingGift = await this._giftRepository.getByIdAsync(giftId);

        if (!existingGift) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        const updatedGift = await this._giftRepository.patchByIdAsync(
            giftId,
            { giftReceived: dto.giftReceived }
        );

        if (!updatedGift) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        return await this._toGiftDetailDtoAsync(updatedGift);
    }

    async HardDeleteAsync(id) {
        const giftId = validateRequiredObjectId(id, 'id');
        const deletedGift = await this._giftRepository.deleteByIdAsync(giftId);

        if (!deletedGift) {
            throw new NotFoundError(`Regalo (${giftId}) no encontrado.`);
        }

        return await this._toGiftDetailDtoAsync(deletedGift);
    }

    _resolveNullableUrl(value, currentValue) {
        if (value === undefined) return currentValue;
        if (value === null) return null;
        return normalizeText(value);
    }

    async _toGiftDetailDtoAsync(giftEntity, audit = null) {
        const references = await this._getReferenceMapsAsync([giftEntity]);
        const product = references.products.get(giftEntity.productId) ?? null;

        return new GiftDetailDto({
            id: giftEntity.id,
            userId: giftEntity.userId,
            userName: references.userNames.get(giftEntity.userId) ?? null,
            productId: giftEntity.productId,
            productName: product?.productName ?? null,
            productImgPublicId: product?.productImgPublicId ?? null,
            petId: giftEntity.petId,
            petName: references.petNames.get(giftEntity.petId) ?? null,
            giftReceived: giftEntity.giftReceived,
            googlePhotoPetUrl: giftEntity.googlePhotoPetUrl,
            googleFolderPetUrl: giftEntity.googleFolderPetUrl,
            date: giftEntity.date,
            audit
        });
    }

    async _toGiftListItemDtosAsync(giftEntities) {
        const references = await this._getReferenceMapsAsync(giftEntities);

        return giftEntities.map(giftEntity => {
            const product = references.products.get(giftEntity.productId) ?? null;

            return new GiftListItemDto({
                id: giftEntity.id ?? giftEntity._id?.toString?.(),
                userName: references.userNames.get(giftEntity.userId) ?? null,
                productName: product?.productName ?? null,
                productImgPublicId: product?.productImgPublicId ?? null,
                petName: references.petNames.get(giftEntity.petId) ?? null,
                giftReceived: giftEntity.giftReceived,
                googlePhotoPetUrl: giftEntity.googlePhotoPetUrl,
                date: giftEntity.date
            });
        });
    }

    async _getReferenceMapsAsync(giftEntities) {
        const result = await this._giftQueries.getGiftReferencesByIdsQueryAsync({
            userIds: giftEntities.map(gift => gift.userId),
            productIds: giftEntities.map(gift => gift.productId),
            petIds: giftEntities.map(gift => gift.petId)
        });

        return {
            userNames: new Map(
                result.users.map(user => [user.userId, user.userName])
            ),
            products: new Map(
                result.products.map(product => [product.productId, product])
            ),
            petNames: new Map(
                result.pets.map(pet => [pet.petId, pet.petName])
            )
        };
    }
}

module.exports = GiftService;
