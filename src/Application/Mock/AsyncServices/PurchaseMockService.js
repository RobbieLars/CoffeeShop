const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');

const {
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreatePurchaseDto,
    UpdatePurchaseDto,
    PurchaseListItemDto,
    PurchaseDetailDto
} = require('../../DTOs/PurchaseDto');

const IPurchaseMockData = require('../Data/IPurchaseMockData');

// Servicio de Purchase respaldado por datos simulados.
// Expone el mismo contrato asíncrono que PurchaseService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class PurchaseMockService {
    constructor(purchaseMockData = new IPurchaseMockData()) {
        this._purchaseMockData = purchaseMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._purchaseMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new PurchaseListItemDto({
                id: item.id,
                productName: item.productName,
                userName: item.userName,
                petName: item.petName,
                day: item.day
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredPurchase(id);
    }

    async CreateAsync(createPurchaseDto) {
        const dto = createPurchaseDto instanceof CreatePurchaseDto
            ? createPurchaseDto
            : new CreatePurchaseDto(createPurchaseDto);

        const items = this._purchaseMockData.GetItems();

        const references = this._resolveReferences(
            {
                productId: dto.productId,
                userId: dto.userId,
                petId: dto.petId
            },
            items
        );

        const createdPurchase = new PurchaseDetailDto({
            id: this._createId(items),

            productId: dto.productId,
            productName: references.productName,

            userId: dto.userId,
            userName: references.userName,

            petId: dto.petId,
            petName: references.petName,

            day: new Date(),
            photoPublicId: null
        });

        this._purchaseMockData.ReplaceItems([
            ...items,
            createdPurchase
        ]);

        return new PurchaseDetailDto(createdPurchase);
    }

    async UpdateAsync(id, updatePurchaseDto) {
        const dto = updatePurchaseDto instanceof UpdatePurchaseDto
            ? updatePurchaseDto
            : new UpdatePurchaseDto(updatePurchaseDto);

        const items = this._purchaseMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Compra (${id}) no encontrada.`
            );
        }

        const currentPurchase = items[itemIndex];

        const productId = dto.productId === undefined
            ? currentPurchase.productId
            : dto.productId;

        const userId = dto.userId === undefined
            ? currentPurchase.userId
            : dto.userId;

        const petId = dto.petId === undefined
            ? currentPurchase.petId
            : dto.petId;

        const references = this._resolveReferences(
            {
                productId,
                userId,
                petId
            },
            items,
            currentPurchase
        );

        const updatedPurchase = new PurchaseDetailDto({
            id: currentPurchase.id,

            productId,
            productName: references.productName,

            userId,
            userName: references.userName,

            petId,
            petName: references.petName,

            day: dto.day === undefined
                ? currentPurchase.day
                : dto.day,

            photoPublicId: dto.photoPublicId === undefined
                ? currentPurchase.photoPublicId
                : dto.photoPublicId,

            audit: currentPurchase.audit
        });

        items[itemIndex] = updatedPurchase;

        this._purchaseMockData.ReplaceItems(items);

        return new PurchaseDetailDto(updatedPurchase);
    }

    async HardDeleteAsync(id) {
        const purchase = this._getRequiredPurchase(id);

        const remainingItems = this._purchaseMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._purchaseMockData.ReplaceItems(remainingItems);

        return new PurchaseDetailDto(purchase);
    }

    _getRequiredPurchase(id) {
        const purchase = this._purchaseMockData
            .GetItems()
            .find(item => item.id === id);

        if (!purchase) {
            throw new NotFoundError(
                `Compra (${id}) no encontrada.`
            );
        }

        return new PurchaseDetailDto(purchase);
    }

    _resolveReferences(
        { productId, userId, petId },
        items,
        currentPurchase = null
    ) {
        const productReference = items.find(
            item => item.productId === productId
        );

        const userReference = items.find(
            item => item.userId === userId
        );

        const petReference = items.find(
            item => item.petId === petId
        );

        return {
            productName:
                productReference?.productName ??
                (
                    currentPurchase?.productId === productId
                        ? currentPurchase.productName
                        : null
                ),

            userName:
                userReference?.userName ??
                (
                    currentPurchase?.userId === userId
                        ? currentPurchase.userName
                        : null
                ),

            petName:
                petReference?.petName ??
                (
                    currentPurchase?.petId === petId
                        ? currentPurchase.petName
                        : null
                )
        };
    }

    _matchesFilters(purchase, filters) {
        if (filters.productId) {
            if (purchase.productId !== filters.productId) {
                return false;
            }
        }

        if (filters.userId) {
            if (purchase.userId !== filters.userId) {
                return false;
            }
        }

        if (filters.petId) {
            if (purchase.petId !== filters.petId) {
                return false;
            }
        }

        if (filters.productName) {
            const productName = String(filters.productName)
                .trim()
                .toLowerCase();

            if (
                !String(purchase.productName ?? '')
                    .toLowerCase()
                    .includes(productName)
            ) {
                return false;
            }
        }

        if (filters.userName) {
            const userName = String(filters.userName)
                .trim()
                .toLowerCase();

            if (
                !String(purchase.userName ?? '')
                    .toLowerCase()
                    .includes(userName)
            ) {
                return false;
            }
        }

        if (filters.petName) {
            const petName = String(filters.petName)
                .trim()
                .toLowerCase();

            if (
                !String(purchase.petName ?? '')
                    .toLowerCase()
                    .includes(petName)
            ) {
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

module.exports = PurchaseMockService;