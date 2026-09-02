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

const IPersonQueries = require('../Interfaces/CQRS/Queries/IPersonQueries');

class PersonService {

    constructor(personRepository, personQueries, paginationService) {
        this._personRepository = personRepository;
        this._paginationService = paginationService;

        if (!(personQueries instanceof IPersonQueries)) {
            throw new Error('personQueries debe implementar IPersonQueries');
        }

        this._personQueries = personQueries;

        this._createPersonDtoValidator = new CreatePersonDtoValidator();
        this._updatePersonDtoValidator = new UpdatePersonDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._personRepository,
            paginationData,
            personEntity => personEntity,
            searchCriteria,
            personEntities => this._toPersonListItemDtosAsync(personEntities)
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

        return await this._toPersonDetailDtoAsync(
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
                : normalizeText(dto.email).toLowerCase(),
            googleFolderPersonUrl: null
        });

        try {
            const createdPersonEntity =
                await this._personRepository.createAsync(personEntity);

            return await this._toPersonDetailDtoAsync(createdPersonEntity);

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
                    : normalizeText(dto.email).toLowerCase(),

            googleFolderPersonUrl: dto.googleFolderPersonUrl === undefined
                ? existingPersonEntity.googleFolderPersonUrl
                : dto.googleFolderPersonUrl === null
                    ? null
                    : normalizeText(dto.googleFolderPersonUrl)
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

            return await this._toPersonDetailDtoAsync(updatedPersonEntity);

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

        return await this._toPersonDetailDtoAsync(deletedPersonEntity);
    }

    async _toPersonDetailDtoAsync(personEntity, audit = null) {
        const users = await this._personQueries
            .getUsersByPersonIdsQueryAsync([personEntity.id]);
        const relatedUser = users[0] ?? null;

        return new PersonDetailDto({
            id: personEntity.id,
            name: personEntity.name,
            secondName: personEntity.secondName,
            lastName: personEntity.lastName,
            secondLastName: personEntity.secondLastName,
            birthDate: personEntity.birthDate,
            gender: personEntity.gender,
            userId: relatedUser?.userId ?? null,
            userName: relatedUser?.userName ?? null,
            email: personEntity.email,
            googleFolderPersonUrl: personEntity.googleFolderPersonUrl,
            audit
        });
    }

    async _toPersonListItemDtosAsync(personEntities) {
        const personIds = personEntities.map(
            personEntity => personEntity.id ?? personEntity._id?.toString?.()
        );
        const users = await this._personQueries
            .getUsersByPersonIdsQueryAsync(personIds);
        const userByPersonId = new Map();

        for (const user of users) {
            if (!userByPersonId.has(user.personId)) {
                userByPersonId.set(user.personId, user);
            }
        }

        return personEntities.map(personEntity => {
            const id = personEntity.id ?? personEntity._id?.toString?.();
            const relatedUser = userByPersonId.get(id) ?? null;

            return new PersonListItemDto({
                id,
                name: personEntity.name,
                lastName: personEntity.lastName,
                userName: relatedUser?.userName ?? null,
                email: personEntity.email
            });
        });
    }
}

module.exports = PersonService;
