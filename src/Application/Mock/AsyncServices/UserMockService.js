const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

const {
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreateUserDto,
    UpdateUserDto,
    UserListItemDto,
    UserDetailDto
} = require('../../DTOs/UserDto');

const IUserMockData = require('../Data/IUserMockData');

// Servicio de User respaldado por datos simulados.
// Expone el mismo contrato asíncrono que UserService sin usar CQRS,
// repositorios, password hashing ni dependencias de infraestructura.
class UserMockService {
    constructor(userMockData = new IUserMockData()) {
        this._userMockData = userMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._userMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex =
            (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new UserListItemDto({
                id: item.id,
                photoProfilePublicId: item.photoProfilePublicId,
                username: item.username,
                enabled: item.enabled
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredUser(id);
    }

    async CreateAsync(createUserDto) {
        const dto = createUserDto instanceof CreateUserDto
            ? createUserDto
            : new CreateUserDto(createUserDto);

        const items = this._userMockData.GetItems();

        const createdUser = new UserDetailDto({
            id: this._createId(items),

            photoProfilePublicId:
                dto.photoProfilePublicId?.trim() ?? '',

            username: dto.username
                .trim()
                .toLowerCase(),

            verified: false,
            lockedUntil: null,
            failedLoginAttempts: 0,
            personId: dto.personId,
            enabled: true
        });

        this._userMockData.ReplaceItems([
            ...items,
            createdUser
        ]);

        return new UserDetailDto(createdUser);
    }

    async UpdateAsync(id, updateUserDto) {
        const dto = updateUserDto instanceof UpdateUserDto
            ? updateUserDto
            : new UpdateUserDto(updateUserDto);

        const items = this._userMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Usuario (${id}) no encontrado.`
            );
        }

        const currentUser = items[itemIndex];

        const updatedUser = new UserDetailDto({
            id: currentUser.id,

            photoProfilePublicId:
                dto.photoProfilePublicId === undefined
                    ? currentUser.photoProfilePublicId
                    : dto.photoProfilePublicId.trim(),

            username:
                dto.username === undefined
                    ? currentUser.username
                    : dto.username.trim().toLowerCase(),

            verified:
                dto.verified === undefined
                    ? currentUser.verified
                    : dto.verified,

            lockedUntil:
                dto.lockedUntil === undefined
                    ? currentUser.lockedUntil
                    : dto.lockedUntil,

            failedLoginAttempts:
                dto.failedLoginAttempts === undefined
                    ? currentUser.failedLoginAttempts
                    : dto.failedLoginAttempts,

            personId:
                dto.personId === undefined
                    ? currentUser.personId
                    : dto.personId,

            enabled:
                dto.enabled === undefined
                    ? currentUser.enabled
                    : dto.enabled,

            audit: currentUser.audit
        });

        items[itemIndex] = updatedUser;

        this._userMockData.ReplaceItems(items);

        return new UserDetailDto(updatedUser);
    }

    async SoftDeleteAsync(id) {
        const user = this._getRequiredUser(id);

        if (user.enabled === false) {
            throw new ConflictError(
                'El Usuario ya está inhabilitado.'
            );
        }

        return this._setEnabled(id, false);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);

        this._getRequiredUser(id);

        return this._setEnabled(id, dto.enabled);
    }

    async HardDeleteAsync(id) {
        const user = this._getRequiredUser(id);

        const remainingItems = this._userMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._userMockData.ReplaceItems(remainingItems);

        return new UserDetailDto(user);
    }

    _getRequiredUser(id) {
        const user = this._userMockData
            .GetItems()
            .find(item => item.id === id);

        if (!user) {
            throw new NotFoundError(
                `Usuario (${id}) no encontrado.`
            );
        }

        return new UserDetailDto(user);
    }

    _setEnabled(id, enabled) {
        const items = this._userMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        const updatedUser = new UserDetailDto({
            ...items[itemIndex],
            enabled
        });

        items[itemIndex] = updatedUser;

        this._userMockData.ReplaceItems(items);

        return new UserDetailDto(updatedUser);
    }

    _matchesFilters(user, filters) {
        if (filters.username) {
            const username = String(filters.username)
                .trim()
                .toLowerCase();

            if (
                !String(user.username)
                    .toLowerCase()
                    .includes(username)
            ) {
                return false;
            }
        }

        if (filters.personId) {
            if (user.personId !== filters.personId) {
                return false;
            }
        }

        if (
            filters.verified !== undefined &&
            filters.verified !== ''
        ) {
            const verified =
                filters.verified === true ||
                filters.verified === 'true';

            if (user.verified !== verified) {
                return false;
            }
        }

        if (
            filters.enabled !== undefined &&
            filters.enabled !== ''
        ) {
            const enabled =
                filters.enabled === true ||
                filters.enabled === 'true';

            if (user.enabled !== enabled) {
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

module.exports = UserMockService;