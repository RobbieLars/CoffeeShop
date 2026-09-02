const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');

const {
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreateGiftDto,
    UpdateGiftDto,
    PatchGiftReceivedDto,
    GiftListItemDto,
    GiftDetailDto
} = require('../../DTOs/GiftDto');

const IGiftMockData = require('../Data/IGiftMockData');

// Servicio de Gift respaldado por datos simulados.
// Expone el mismo contrato asíncrono que GiftService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class GiftMockService {
    constructor(giftMockData = new IGiftMockData()) {
        this._giftMockData = giftMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._giftMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new GiftListItemDto({
                id: item.id,
                userName: item.userName,
                productName: item.productName,
                productImgPublicId: item.productImgPublicId,
                petName: item.petName,
                giftReceived: item.giftReceived,
                googlePhotoPetUrl: item.googlePhotoPetUrl,
                date: item.date
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredGift(id);
    }

    async CreateAsync(createGiftDto) {
        const dto = createGiftDto instanceof CreateGiftDto
            ? createGiftDto
            : new CreateGiftDto(createGiftDto);

        const items = this._giftMockData.GetItems();

        const references = this._resolveReferences(
            {
                userId: dto.userId,
                productId: dto.productId,
                petId: dto.petId
            },
            items
        );

        const createdGift = new GiftDetailDto({
            id: this._createId(items),
            userId: dto.userId,
            userName: references.userName,
            productId: dto.productId,
            productName: references.productName,
            productImgPublicId: references.productImgPublicId,
            petId: dto.petId,
            petName: references.petName,
            giftReceived: false,
            googlePhotoPetUrl: null,
            googleFolderPetUrl: null,
            date: new Date()
        });

        this._giftMockData.ReplaceItems([
            ...items,
            createdGift
        ]);

        return new GiftDetailDto(createdGift);
    }

    async UpdateAsync(id, updateGiftDto) {
        const dto = updateGiftDto instanceof UpdateGiftDto
            ? updateGiftDto
            : new UpdateGiftDto(updateGiftDto);

        const items = this._giftMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Regalo (${id}) no encontrado.`
            );
        }

        const currentGift = items[itemIndex];

        const userId =
            dto.userId ?? currentGift.userId;

        const productId =
            dto.productId ?? currentGift.productId;

        const petId =
            dto.petId ?? currentGift.petId;

        const references = this._resolveReferences(
            {
                userId,
                productId,
                petId
            },
            items,
            currentGift
        );

        const updatedGift = new GiftDetailDto({
            id: currentGift.id,

            userId,
            userName: references.userName,

            productId,
            productName: references.productName,
            productImgPublicId:
                references.productImgPublicId,

            petId,
            petName: references.petName,

            giftReceived:
                dto.giftReceived ??
                currentGift.giftReceived,

            googlePhotoPetUrl:
                this._resolveNullableUrl(
                    dto.googlePhotoPetUrl,
                    currentGift.googlePhotoPetUrl
                ),

            googleFolderPetUrl:
                this._resolveNullableUrl(
                    dto.googleFolderPetUrl,
                    currentGift.googleFolderPetUrl
                ),

            date: dto.date === undefined
                ? currentGift.date
                : new Date(dto.date),

            audit: currentGift.audit
        });

        items[itemIndex] = updatedGift;

        this._giftMockData.ReplaceItems(items);

        return new GiftDetailDto(updatedGift);
    }

    async PatchReceivedAsync(id, patchGiftReceivedDto) {
        const dto =
            patchGiftReceivedDto instanceof PatchGiftReceivedDto
                ? patchGiftReceivedDto
                : new PatchGiftReceivedDto(
                    patchGiftReceivedDto
                );

        const items = this._giftMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Regalo (${id}) no encontrado.`
            );
        }

        const currentGift = items[itemIndex];

        const updatedGift = new GiftDetailDto({
            ...currentGift,
            giftReceived: dto.giftReceived
        });

        items[itemIndex] = updatedGift;

        this._giftMockData.ReplaceItems(items);

        return new GiftDetailDto(updatedGift);
    }

    async HardDeleteAsync(id) {
        const gift = this._getRequiredGift(id);

        const remainingItems = this._giftMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._giftMockData.ReplaceItems(remainingItems);

        return new GiftDetailDto(gift);
    }

    _getRequiredGift(id) {
        const gift = this._giftMockData
            .GetItems()
            .find(item => item.id === id);

        if (!gift) {
            throw new NotFoundError(
                `Regalo (${id}) no encontrado.`
            );
        }

        return new GiftDetailDto(gift);
    }

    _resolveNullableUrl(value, currentValue) {
        if (value === undefined) {
            return currentValue;
        }

        if (value === null) {
            return null;
        }

        return String(value).trim();
    }

    _resolveReferences(
        { userId, productId, petId },
        items,
        currentGift = null
    ) {
        const userReference = items.find(
            item => item.userId === userId
        );

        const productReference = items.find(
            item => item.productId === productId
        );

        const petReference = items.find(
            item => item.petId === petId
        );

        return {
            userName:
                userReference?.userName ??
                (
                    currentGift?.userId === userId
                        ? currentGift.userName
                        : null
                ),

            productName:
                productReference?.productName ??
                (
                    currentGift?.productId === productId
                        ? currentGift.productName
                        : null
                ),

            productImgPublicId:
                productReference?.productImgPublicId ??
                (
                    currentGift?.productId === productId
                        ? currentGift.productImgPublicId
                        : null
                ),

            petName:
                petReference?.petName ??
                (
                    currentGift?.petId === petId
                        ? currentGift.petName
                        : null
                )
        };
    }

    _matchesFilters(gift, filters) {
        if (filters.userId) {
            if (gift.userId !== filters.userId) {
                return false;
            }
        }

        if (filters.productId) {
            if (gift.productId !== filters.productId) {
                return false;
            }
        }

        if (filters.petId) {
            if (gift.petId !== filters.petId) {
                return false;
            }
        }

        if (
            filters.giftReceived !== undefined &&
            filters.giftReceived !== ''
        ) {
            const giftReceived =
                filters.giftReceived === true ||
                filters.giftReceived === 'true';

            if (gift.giftReceived !== giftReceived) {
                return false;
            }
        }

        return true;
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

module.exports = GiftMockService;