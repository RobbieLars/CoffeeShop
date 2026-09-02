const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');

const {
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreatePetDto,
    UpdatePetDto,
    PatchPetOwnerDto,
    PetListItemDto,
    PetDetailDto
} = require('../../DTOs/PetDto');

const IPetMockData = require('../Data/IPetMockData');

// Servicio de Pet respaldado por datos simulados.
// Expone el mismo contrato asíncrono que PetService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class PetMockService {
    constructor(petMockData = new IPetMockData()) {
        this._petMockData = petMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._petMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new PetListItemDto({
                id: item.id,
                ownerId: item.ownerId,
                ownerName: item.ownerName,
                photoPublicId: item.photoPublicId,
                name: item.name,
                type: item.type,
                privacy: item.privacy
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredPet(id);
    }

    async CreateAsync(createPetDto) {
        const dto = createPetDto instanceof CreatePetDto
            ? createPetDto
            : new CreatePetDto(createPetDto);

        const items = this._petMockData.GetItems();

        const owner = this._getRequiredOwner(
            dto.ownerId,
            items
        );

        const createdPet = new PetDetailDto({
            id: this._createId(items),
            ownerId: dto.ownerId,
            ownerName: owner.ownerName,
            photoPublicId: dto.photoPublicId ?? null,
            name: this._normalizeText(dto.name),
            type: Number(dto.type),
            birthDate: dto.birthDate
                ? new Date(dto.birthDate)
                : null,
            gender: Number(dto.gender),
            weight:
                dto.weight !== undefined &&
                dto.weight !== null
                    ? Number(dto.weight)
                    : null,
            favoriteFood: dto.favoriteFood
                ? this._normalizeText(dto.favoriteFood)
                : null,
            privacy: true
        });

        this._petMockData.ReplaceItems([
            ...items,
            createdPet
        ]);

        return new PetDetailDto(createdPet);
    }

    async UpdateAsync(id, updatePetDto) {
        const dto = updatePetDto instanceof UpdatePetDto
            ? updatePetDto
            : new UpdatePetDto(updatePetDto);

        const items = this._petMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Mascota (${id}) no encontrada.`
            );
        }

        const currentPet = items[itemIndex];

        const owner = dto.ownerId === undefined
            ? null
            : this._getRequiredOwner(
                dto.ownerId,
                items
            );

        const updatedPet = new PetDetailDto({
            id: currentPet.id,

            ownerId: dto.ownerId === undefined
                ? currentPet.ownerId
                : dto.ownerId,

            ownerName: owner
                ? owner.ownerName
                : currentPet.ownerName,

            photoPublicId: dto.photoPublicId === undefined
                ? currentPet.photoPublicId
                : dto.photoPublicId,

            name: dto.name === undefined
                ? currentPet.name
                : this._normalizeText(dto.name),

            type: dto.type === undefined
                ? currentPet.type
                : Number(dto.type),

            birthDate: dto.birthDate === undefined
                ? currentPet.birthDate
                : dto.birthDate
                    ? new Date(dto.birthDate)
                    : null,

            gender: dto.gender === undefined
                ? currentPet.gender
                : Number(dto.gender),

            weight: dto.weight === undefined
                ? currentPet.weight
                : dto.weight !== null
                    ? Number(dto.weight)
                    : null,

            favoriteFood: dto.favoriteFood === undefined
                ? currentPet.favoriteFood
                : dto.favoriteFood
                    ? this._normalizeText(dto.favoriteFood)
                    : null,

            privacy: dto.privacy === undefined
                ? currentPet.privacy
                : dto.privacy,

            audit: currentPet.audit
        });

        items[itemIndex] = updatedPet;

        this._petMockData.ReplaceItems(items);

        return new PetDetailDto(updatedPet);
    }

    async PatchOwnerAsync(id, patchPetOwnerDto) {
        const dto = patchPetOwnerDto instanceof PatchPetOwnerDto
            ? patchPetOwnerDto
            : new PatchPetOwnerDto(patchPetOwnerDto);

        const items = this._petMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Mascota (${id}) no encontrada.`
            );
        }

        const owner = this._getRequiredOwner(
            dto.ownerId,
            items
        );

        const currentPet = items[itemIndex];

        const updatedPet = new PetDetailDto({
            ...currentPet,
            ownerId: dto.ownerId,
            ownerName: owner.ownerName
        });

        items[itemIndex] = updatedPet;

        this._petMockData.ReplaceItems(items);

        return new PetDetailDto(updatedPet);
    }

    async HardDeleteAsync(id) {
        const pet = this._getRequiredPet(id);

        const remainingItems = this._petMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._petMockData.ReplaceItems(remainingItems);

        return new PetDetailDto(pet);
    }

    _getRequiredPet(id) {
        const pet = this._petMockData
            .GetItems()
            .find(item => item.id === id);

        if (!pet) {
            throw new NotFoundError(
                `Mascota (${id}) no encontrada.`
            );
        }

        return new PetDetailDto(pet);
    }

    _getRequiredOwner(ownerId, items) {
        const ownerPet = items.find(
            item => item.ownerId === ownerId
        );

        if (!ownerPet) {
            throw new NotFoundError(
                `Propietario (${ownerId}) no encontrado.`
            );
        }

        return {
            ownerId,
            ownerName: ownerPet.ownerName
        };
    }

    _matchesFilters(pet, filters) {
        if (filters.ownerId) {
            if (pet.ownerId !== filters.ownerId) {
                return false;
            }
        }

        if (filters.ownerName) {
            const ownerName = String(filters.ownerName)
                .trim()
                .toLowerCase();

            if (
                !String(pet.ownerName ?? '')
                    .toLowerCase()
                    .includes(ownerName)
            ) {
                return false;
            }
        }

        if (filters.name) {
            const name = String(filters.name)
                .trim()
                .toLowerCase();

            if (
                !String(pet.name)
                    .toLowerCase()
                    .includes(name)
            ) {
                return false;
            }
        }

        if (
            filters.type !== undefined &&
            filters.type !== ''
        ) {
            if (pet.type !== Number(filters.type)) {
                return false;
            }
        }

        if (
            filters.gender !== undefined &&
            filters.gender !== ''
        ) {
            if (pet.gender !== Number(filters.gender)) {
                return false;
            }
        }

        if (
            filters.privacy !== undefined &&
            filters.privacy !== ''
        ) {
            const privacy =
                filters.privacy === true ||
                filters.privacy === 'true';

            if (pet.privacy !== privacy) {
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

module.exports = PetMockService;