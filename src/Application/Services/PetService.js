// PetService.js

const {
    PetListItemDto,
    PetDetailDto,
    CreatePetDto,
    UpdatePetDto,
    PatchPetOwnerDto
} = require('../DTOs/PetDto');

const Pet = require('../../Domain/Entities/Pet');
const PetType = require('../../Domain/Constants/PetType');

const {
    CreatePetDtoValidator,
    UpdatePetDtoValidator,
    PatchPetOwnerDtoValidator
} = require('../Validators/Service/PetDtoValidator');

const IPetQueries = require('../Interfaces/CQRS/Queries/IPetQueries');

const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

const {
    ValidationError,
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class PetService {
    constructor(petRepository, petQueries, paginationService) {
        this._petRepository = petRepository;
        this._paginationService = paginationService;

        if (!(petQueries instanceof IPetQueries)) {
            throw new Error('petQueries debe implementar IPetQueries');
        }

        this._petQueries = petQueries;

        this._createPetDtoValidator = new CreatePetDtoValidator();
        this._updatePetDtoValidator = new UpdatePetDtoValidator();
        this._patchPetOwnerDtoValidator = new PatchPetOwnerDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._petRepository,
            paginationData,
            petEntity => petEntity,
            searchCriteria,
            petEntities => this._toPetListItemDtosAsync(petEntities)
        );
    }

    async GetByIdAsync(id) {
        const petId = validateRequiredObjectId(id, 'id');

        const petEntity =
            await this._petRepository.getByIdWithAuditAsync(petId);

        if (!petEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return await this._toPetDetailDtoAsync(
            petEntity.entity,
            petEntity.audit
        );
    }

    async CreateAsync(createPetDto) {
        const dto = createPetDto instanceof CreatePetDto
            ? createPetDto
            : new CreatePetDto(createPetDto);

        const validationErrors = this._createPetDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const owner = await this._getRequiredOwnerAsync(dto.ownerId);

        const petEntity = new Pet({
            ownerId: dto.ownerId,
            photoPublicId: dto.photoPublicId ?? null,
            name: normalizeText(dto.name),
            type: Number(dto.type),
            birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
            gender: Number(dto.gender),
            weight: dto.weight !== undefined && dto.weight !== null ? Number(dto.weight) : null,
            favoriteFood: dto.favoriteFood ? normalizeText(dto.favoriteFood) : null,
            privacy: true
        });

        const createdPetEntity = await this._petRepository.createAsync(petEntity);
        return await this._toPetDetailDtoAsync(createdPetEntity, null, owner);
    }

    async UpdateAsync(id, updatePetDto) {
        const petId = validateRequiredObjectId(id, 'id');

        const dto = updatePetDto instanceof UpdatePetDto
            ? updatePetDto
            : new UpdatePetDto(updatePetDto);

        const validationErrors = this._updatePetDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingPetEntity = await this._petRepository.getByIdAsync(petId);

        if (!existingPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        const owner = dto.ownerId === undefined
            ? undefined
            : await this._getRequiredOwnerAsync(dto.ownerId);

        const petEntity = new Pet({
            id: petId,
            ownerId: resolveUpdateValue(
                dto.ownerId,
                existingPetEntity.ownerId
            ),
            photoPublicId: dto.photoPublicId === undefined
                ? existingPetEntity.photoPublicId
                : dto.photoPublicId,
            name: resolveUpdateValue(
                dto.name,
                existingPetEntity.name,
                normalizeText
            ),
            type: resolveUpdateValue(
                dto.type,
                existingPetEntity.type,
                Number
            ),
            birthDate: dto.birthDate === undefined
                ? existingPetEntity.birthDate
                : (dto.birthDate ? new Date(dto.birthDate) : null),
            gender: resolveUpdateValue(
                dto.gender,
                existingPetEntity.gender,
                Number
            ),
            weight: dto.weight === undefined
                ? existingPetEntity.weight
                : (dto.weight !== null ? Number(dto.weight) : null),
            favoriteFood: dto.favoriteFood === undefined
                ? existingPetEntity.favoriteFood
                : (dto.favoriteFood ? normalizeText(dto.favoriteFood) : null),
            privacy: resolveUpdateValue(
                dto.privacy,
                existingPetEntity.privacy
            )
        });

        const updatedPetEntity = await this._petRepository.updateByIdAsync(petId, petEntity);

        if (!updatedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return await this._toPetDetailDtoAsync(updatedPetEntity, null, owner);
    }

    async PatchOwnerAsync(id, patchPetOwnerDto) {
        const petId = validateRequiredObjectId(id, 'id');

        const dto = patchPetOwnerDto instanceof PatchPetOwnerDto
            ? patchPetOwnerDto
            : new PatchPetOwnerDto(patchPetOwnerDto);

        const validationErrors = this._patchPetOwnerDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingPetEntity = await this._petRepository.getByIdAsync(petId);

        if (!existingPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        const owner = await this._getRequiredOwnerAsync(dto.ownerId);

        const updatedPetEntity = await this._petRepository.patchByIdAsync(
            petId,
            { ownerId: dto.ownerId }
        );

        if (!updatedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return await this._toPetDetailDtoAsync(updatedPetEntity, null, owner);
    }

    async HardDeleteAsync(id) {
        const petId = validateRequiredObjectId(id, 'id');

        const deletedPetEntity = await this._petRepository.deleteByIdAsync(petId);

        if (!deletedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return await this._toPetDetailDtoAsync(deletedPetEntity);
    }

    async _getRequiredOwnerAsync(ownerId) {
        const validOwnerId = validateRequiredObjectId(ownerId, 'ownerId');
        const owners = await this._petQueries
            .getOwnersByIdsQueryAsync([validOwnerId]);
        const owner = owners[0] ?? null;

        if (!owner) {
            throw new NotFoundError(
                `Propietario (${validOwnerId}) no encontrado.`
            );
        }

        return owner;
    }

    async _toPetDetailDtoAsync(petEntity, audit = null, owner = undefined) {
        const relatedOwner = owner === undefined
            ? (await this._petQueries.getOwnersByIdsQueryAsync([petEntity.ownerId]))[0] ?? null
            : owner;

        return new PetDetailDto({
            id: petEntity.id,
            ownerId: petEntity.ownerId,
            ownerName: relatedOwner?.ownerName ?? null,
            photoPublicId: petEntity.photoPublicId,
            name: petEntity.name,
            type: petEntity.type,
            typeName: this._getPetTypeName(petEntity.type),
            birthDate: petEntity.birthDate,
            gender: petEntity.gender,
            weight: petEntity.weight,
            favoriteFood: petEntity.favoriteFood,
            privacy: petEntity.privacy,
            audit
        });
    }

    async _toPetListItemDtosAsync(petEntities) {
        const ownerIds = petEntities.map(petEntity => petEntity.ownerId);
        const owners = await this._petQueries.getOwnersByIdsQueryAsync(ownerIds);
        const ownerById = new Map(
            owners.map(owner => [owner.ownerId, owner])
        );

        return petEntities.map(petEntity => {
            const owner = ownerById.get(petEntity.ownerId) ?? null;

            return new PetListItemDto({
                id: petEntity.id ?? petEntity._id,
                ownerId: petEntity.ownerId,
                ownerName: owner?.ownerName ?? null,
                photoPublicId: petEntity.photoPublicId,
                name: petEntity.name,
                type: petEntity.type,
                typeName: this._getPetTypeName(petEntity.type),
                privacy: petEntity.privacy
            });
        });
    }

    _getPetTypeName(type) {
        return Object.entries(PetType)
            .find(([, value]) => value === Number(type))?.[0] ?? null;
    }
}

module.exports = PetService;
