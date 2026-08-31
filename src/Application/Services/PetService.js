// PetService.js

const {
    PetListItemDto,
    PetDetailDto,
    CreatePetDto,
    UpdatePetDto
} = require('../DTOs/PetDto');

const Pet = require('../../Domain/Entities/Pet');

const {
    CreatePetDtoValidator,
    UpdatePetDtoValidator
} = require('../Validators/Service/PetDtoValidator');

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

class PetService {
    constructor(petRepository, paginationService) {
        this._petRepository = petRepository;
        this._paginationService = paginationService;

        this._createPetDtoValidator = new CreatePetDtoValidator();
        this._updatePetDtoValidator = new UpdatePetDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._petRepository,
            paginationData,
            petEntity => this._toPetListItemDto(petEntity),
            searchCriteria
        );
    }

    async GetByIdAsync(id) {
        const petId = validateRequiredObjectId(id, 'id');

        const petEntity =
            await this._petRepository.getByIdWithAuditAsync(petId);

        if (!petEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return this._toPetDetailDto(
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

        const petEntity = new Pet({
            photoPublicId: dto.photoPublicId ?? null,
            name: normalizeText(dto.name),
            type: Number(dto.type),
            breed: Number(dto.breed),
            birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
            gender: Number(dto.gender),
            weight: dto.weight !== undefined && dto.weight !== null ? Number(dto.weight) : null,
            favoriteFood: dto.favoriteFood ? normalizeText(dto.favoriteFood) : null,
            enabled: true
        });

        const createdPetEntity = await this._petRepository.createAsync(petEntity);
        return this._toPetDetailDto(createdPetEntity);
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

        const petEntity = new Pet({
            id: petId,
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
            breed: resolveUpdateValue(
                dto.breed,
                existingPetEntity.breed,
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
            enabled: resolveUpdateValue(
                dto.enabled,
                existingPetEntity.enabled
            )
        });

        const updatedPetEntity = await this._petRepository.updateByIdAsync(petId, petEntity);

        if (!updatedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return this._toPetDetailDto(updatedPetEntity);
    }

    async SoftDeleteAsync(id) {
        const petId = validateRequiredObjectId(id, 'id');

        const existingPetEntity = await this._petRepository.getByIdAsync(petId);

        if (!existingPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        if (existingPetEntity.enabled === false) {
            throw new ConflictError('La Mascota ya está inhabilitada.');
        }

        const updatedPetEntity = await this._petRepository.patchByIdAsync(petId, { enabled: false });

        if (!updatedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return this._toPetDetailDto(updatedPetEntity);
    }

    async HardDeleteAsync(id) {
        const petId = validateRequiredObjectId(id, 'id');

        const deletedPetEntity = await this._petRepository.deleteByIdAsync(petId);

        if (!deletedPetEntity) {
            throw new NotFoundError(`Mascota (${petId}) no encontrada.`);
        }

        return this._toPetDetailDto(deletedPetEntity);
    }

    _toPetDetailDto(petEntity, audit = null) {
        return new PetDetailDto({
            id: petEntity.id,
            photoPublicId: petEntity.photoPublicId,
            name: petEntity.name,
            type: petEntity.type,
            breed: petEntity.breed,
            birthDate: petEntity.birthDate,
            gender: petEntity.gender,
            weight: petEntity.weight,
            favoriteFood: petEntity.favoriteFood,
            enabled: petEntity.enabled,
            audit
        });
    }

    _toPetListItemDto(petEntity) {
        return new PetListItemDto({
            id: petEntity.id ?? petEntity._id,
            photoPublicId: petEntity.photoPublicId,
            name: petEntity.name,
            type: petEntity.type,
            breed: petEntity.breed,
            enabled: petEntity.enabled
        });
    }
}

module.exports = PetService;
