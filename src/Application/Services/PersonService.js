// PersonService.js

// DTOs
const {
    PersonListItemDto,
    PersonDetailDto,
    CreatePersonDto,
    UpdatePersonDto
} = require('../DTOs/PersonDto');

// Entities
const Person = require('../../Domain/Entities/Person');

// Validators
const {
    CreatePersonDtoValidator,
    UpdatePersonDtoValidator
} = require('../Validators/Service/PersonDtoValidator');

// Helpers
const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const handleDuplicateKeyError = require('@coffeeshop/common/Helpers/handleDuplicateKeyError');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

// Errors
const {
    ValidationError,
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class PersonService {

    constructor(personRepository, paginationService) {
        this._personRepository = personRepository;
        this._paginationService = paginationService;

        this._createPersonDtoValidator = new CreatePersonDtoValidator();
        this._updatePersonDtoValidator = new UpdatePersonDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._personRepository,
            paginationData,
            personEntity => this._toPersonListItemDto(personEntity),
            searchCriteria
        );
    }

    async GetByIdAsync(id) {
        const personId = validateRequiredObjectId(id, 'id');

        const personEntity =
            await this._personRepository.getByIdWithAuditAsync(personId);
        if (!personEntity) {
            throw new NotFoundError(
                `Persona (${personId}) no encontrada.`
            );
        }

        return this._toPersonDetailDto(
            personEntity.entity,
            personEntity.audit
        );
    }

    async CreateAsync(createPersonDto) {
        const dto = createPersonDto instanceof CreatePersonDto
            ? createPersonDto
            : new CreatePersonDto(createPersonDto);

        const validationErrors =
            this._createPersonDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const personEntity = new Person({
            name: normalizeText(dto.name),
            secondName: normalizeText(dto.secondName ?? ''),
            lastName: normalizeText(dto.lastName),
            secondLastName: normalizeText(dto.secondLastName ?? ''),
            birthDate: dto.birthDate ?? null,
            gender: dto.gender == null
                ? null
                : normalizeText(dto.gender),
            email: dto.email == null
                ? null
                : normalizeText(dto.email).toLowerCase()
        });

        try {
            const createdPersonEntity =
                await this._personRepository.createAsync(personEntity);

            return this._toPersonDetailDto(createdPersonEntity);

        } catch (error) {
            handleDuplicateKeyError(
                error,
                'Ya existe una Persona con ese correo.'
            );
        }
    }

    async UpdateAsync(id, updatePersonDto) {
        const personId = validateRequiredObjectId(id, 'id');

        const dto = updatePersonDto instanceof UpdatePersonDto
            ? updatePersonDto
            : new UpdatePersonDto(updatePersonDto);

        const validationErrors =
            this._updatePersonDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingPersonEntity =
            await this._personRepository.getByIdAsync(personId);

        if (!existingPersonEntity) {
            throw new NotFoundError(
                `Persona (${personId}) no encontrada.`
            );
        }

        const personEntity = new Person({
            id: personId,

            name: resolveUpdateValue(
                dto.name,
                existingPersonEntity.name,
                normalizeText
            ),

            secondName: resolveUpdateValue(
                dto.secondName,
                existingPersonEntity.secondName,
                normalizeText
            ),

            lastName: resolveUpdateValue(
                dto.lastName,
                existingPersonEntity.lastName,
                normalizeText
            ),

            secondLastName: resolveUpdateValue(
                dto.secondLastName,
                existingPersonEntity.secondLastName,
                normalizeText
            ),

            birthDate: dto.birthDate === undefined
                ? existingPersonEntity.birthDate
                : dto.birthDate,

            gender: dto.gender === undefined
                ? existingPersonEntity.gender
                : dto.gender === null
                    ? null
                    : normalizeText(dto.gender),

            email: dto.email === undefined
                ? existingPersonEntity.email
                : dto.email === null
                    ? null
                    : normalizeText(dto.email).toLowerCase()
        });

        try {
            const updatedPersonEntity =
                await this._personRepository.updateByIdAsync(
                    personId,
                    personEntity
                );

            if (!updatedPersonEntity) {
                throw new NotFoundError(
                    `Persona (${personId}) no encontrada.`
                );
            }

            return this._toPersonDetailDto(updatedPersonEntity);

        } catch (error) {
            handleDuplicateKeyError(
                error,
                'Ya existe una Persona con ese correo.'
            );
        }
    }

    async HardDeleteAsync(id) {
        const personId = validateRequiredObjectId(id, 'id');

        const deletedPersonEntity =
            await this._personRepository.deleteByIdAsync(personId);

        if (!deletedPersonEntity) {
            throw new NotFoundError(
                `Persona (${personId}) no encontrada.`
            );
        }

        return this._toPersonDetailDto(deletedPersonEntity);
    }

    _toPersonDetailDto(personEntity, audit = null) {
        return new PersonDetailDto({
            id: personEntity.id,
            name: personEntity.name,
            secondName: personEntity.secondName,
            lastName: personEntity.lastName,
            secondLastName: personEntity.secondLastName,
            birthDate: personEntity.birthDate,
            gender: personEntity.gender,
            email: personEntity.email,
            audit
        });
    }

    _toPersonListItemDto(personEntity) {
        return new PersonListItemDto({
            id: personEntity.id ?? personEntity._id,
            name: personEntity.name,
            lastName: personEntity.lastName,
            email: personEntity.email
        });
    }
}

module.exports = PersonService;
