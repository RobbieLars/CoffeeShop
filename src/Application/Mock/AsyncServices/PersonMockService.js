const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');

const {
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreatePersonDto,
    UpdatePersonDto,
    PersonListItemDto,
    PersonDetailDto
} = require('../../DTOs/PersonDto');

const IPersonMockData = require('../Data/IPersonMockData');

// Servicio de Person respaldado por datos simulados.
// Expone el mismo contrato asíncrono que PersonService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class PersonMockService {
    constructor(personMockData = new IPersonMockData()) {
        this._personMockData = personMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._personMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new PersonListItemDto({
                id: item.id,
                name: item.name,
                lastName: item.lastName,
                userName: item.userName,
                email: item.email
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredPerson(id);
    }

    async CreateAsync(createPersonDto) {
        const dto = createPersonDto instanceof CreatePersonDto
            ? createPersonDto
            : new CreatePersonDto(createPersonDto);

        const items = this._personMockData.GetItems();

        const createdPerson = new PersonDetailDto({
            id: this._createId(items),
            name: this._normalizeText(dto.name),
            secondName: this._normalizeText(dto.secondName ?? ''),
            lastName: this._normalizeText(dto.lastName),
            secondLastName: this._normalizeText(dto.secondLastName ?? ''),
            birthDate: dto.birthDate ?? null,
            gender: dto.gender == null
                ? null
                : this._normalizeText(dto.gender),
            userId: null,
            userName: null,
            email: dto.email == null
                ? null
                : this._normalizeText(dto.email).toLowerCase(),
            googleFolderPersonUrl: null
        });

        this._personMockData.ReplaceItems([
            ...items,
            createdPerson
        ]);

        return new PersonDetailDto(createdPerson);
    }

    async UpdateAsync(id, updatePersonDto) {
        const dto = updatePersonDto instanceof UpdatePersonDto
            ? updatePersonDto
            : new UpdatePersonDto(updatePersonDto);

        const items = this._personMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Persona (${id}) no encontrada.`
            );
        }

        const currentPerson = items[itemIndex];

        const updatedPerson = new PersonDetailDto({
            id: currentPerson.id,

            name: dto.name === undefined
                ? currentPerson.name
                : this._normalizeText(dto.name),

            secondName: dto.secondName === undefined
                ? currentPerson.secondName
                : this._normalizeText(dto.secondName),

            lastName: dto.lastName === undefined
                ? currentPerson.lastName
                : this._normalizeText(dto.lastName),

            secondLastName: dto.secondLastName === undefined
                ? currentPerson.secondLastName
                : this._normalizeText(dto.secondLastName),

            birthDate: dto.birthDate === undefined
                ? currentPerson.birthDate
                : dto.birthDate,

            gender: dto.gender === undefined
                ? currentPerson.gender
                : dto.gender === null
                    ? null
                    : this._normalizeText(dto.gender),

            userId: currentPerson.userId,
            userName: currentPerson.userName,

            email: dto.email === undefined
                ? currentPerson.email
                : dto.email === null
                    ? null
                    : this._normalizeText(dto.email).toLowerCase(),

            googleFolderPersonUrl:
                dto.googleFolderPersonUrl === undefined
                    ? currentPerson.googleFolderPersonUrl
                    : dto.googleFolderPersonUrl === null
                        ? null
                        : this._normalizeText(
                            dto.googleFolderPersonUrl
                        ),

            audit: currentPerson.audit
        });

        items[itemIndex] = updatedPerson;

        this._personMockData.ReplaceItems(items);

        return new PersonDetailDto(updatedPerson);
    }

    async HardDeleteAsync(id) {
        const person = this._getRequiredPerson(id);

        const remainingItems = this._personMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._personMockData.ReplaceItems(remainingItems);

        return new PersonDetailDto(person);
    }

    _getRequiredPerson(id) {
        const person = this._personMockData
            .GetItems()
            .find(item => item.id === id);

        if (!person) {
            throw new NotFoundError(
                `Persona (${id}) no encontrada.`
            );
        }

        return new PersonDetailDto(person);
    }

    _matchesFilters(person, filters) {
        if (filters.name) {
            const name = String(filters.name)
                .trim()
                .toLowerCase();

            if (
                !String(person.name)
                    .toLowerCase()
                    .includes(name)
            ) {
                return false;
            }
        }

        if (filters.lastName) {
            const lastName = String(filters.lastName)
                .trim()
                .toLowerCase();

            if (
                !String(person.lastName)
                    .toLowerCase()
                    .includes(lastName)
            ) {
                return false;
            }
        }

        if (filters.userName) {
            const userName = String(filters.userName)
                .trim()
                .toLowerCase();

            if (
                !String(person.userName ?? '')
                    .toLowerCase()
                    .includes(userName)
            ) {
                return false;
            }
        }

        if (filters.email) {
            const email = String(filters.email)
                .trim()
                .toLowerCase();

            if (
                !String(person.email ?? '')
                    .toLowerCase()
                    .includes(email)
            ) {
                return false;
            }
        }

        if (filters.gender) {
            const gender = String(filters.gender)
                .trim()
                .toLowerCase();

            if (
                String(person.gender ?? '')
                    .toLowerCase() !== gender
            ) {
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

module.exports = PersonMockService;