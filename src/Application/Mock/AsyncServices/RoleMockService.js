const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');
const {
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');
const {
    CreateRoleDto,
    UpdateRoleDto,
    RoleListItemDto,
    RoleDetailDto
} = require('../../DTOs/RoleDto');
const IRoleMockData = require('../Data/IRoleMockData');

// Servicio de Role respaldado por datos simulados.
// Expone el mismo contrato asíncrono que RoleService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class RoleMockService {
    constructor(roleMockData = new IRoleMockData()) {
        this._roleMockData = roleMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);
        const filters = paginationData?.filters ?? {};

        const filteredItems = this._roleMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex = (pagination.page - 1) * pagination.pageSize;
        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new RoleListItemDto(item));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredRole(id);
    }

    async CreateAsync(createRoleDto) {
        const dto = createRoleDto instanceof CreateRoleDto
            ? createRoleDto
            : new CreateRoleDto(createRoleDto);
        const items = this._roleMockData.GetItems();
        const createdRole = new RoleDetailDto({
            id: this._createId(items),
            name: dto.name,
            description: dto.description,
            enabled: true
        });

        this._roleMockData.ReplaceItems([...items, createdRole]);

        return new RoleDetailDto(createdRole);
    }

    async UpdateAsync(id, updateRoleDto) {
        const dto = updateRoleDto instanceof UpdateRoleDto
            ? updateRoleDto
            : new UpdateRoleDto(updateRoleDto);
        const items = this._roleMockData.GetItems();
        const itemIndex = items.findIndex(item => item.id === id);

        if (itemIndex < 0) {
            throw new NotFoundError(`Rol (${id}) no encontrado.`);
        }

        const currentRole = items[itemIndex];
        const updatedRole = new RoleDetailDto({
            id: currentRole.id,
            name: dto.name ?? currentRole.name,
            description: dto.description ?? currentRole.description,
            enabled: dto.enabled ?? currentRole.enabled,
            audit: currentRole.audit
        });

        items[itemIndex] = updatedRole;
        this._roleMockData.ReplaceItems(items);

        return new RoleDetailDto(updatedRole);
    }

    async SoftDeleteAsync(id) {
        const role = this._getRequiredRole(id);

        if (role.enabled === false) {
            throw new ConflictError('El Rol ya está inhabilitado.');
        }

        return this._setEnabled(id, false);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);

        this._getRequiredRole(id);

        return this._setEnabled(id, dto.enabled);
    }

    async HardDeleteAsync(id) {
        const role = this._getRequiredRole(id);
        const remainingItems = this._roleMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._roleMockData.ReplaceItems(remainingItems);

        return new RoleDetailDto(role);
    }

    _getRequiredRole(id) {
        const role = this._roleMockData
            .GetItems()
            .find(item => item.id === id);

        if (!role) {
            throw new NotFoundError(`Rol (${id}) no encontrado.`);
        }

        return new RoleDetailDto(role);
    }

    _setEnabled(id, enabled) {
        const items = this._roleMockData.GetItems();
        const itemIndex = items.findIndex(item => item.id === id);
        const updatedRole = new RoleDetailDto({
            ...items[itemIndex],
            enabled
        });

        items[itemIndex] = updatedRole;
        this._roleMockData.ReplaceItems(items);

        return new RoleDetailDto(updatedRole);
    }

    _matchesFilters(role, filters) {
        if (filters.name) {
            const name = String(filters.name).trim().toLowerCase();

            if (!String(role.name).toLowerCase().includes(name)) {
                return false;
            }
        }

        if (filters.enabled !== undefined && filters.enabled !== '') {
            const enabled = filters.enabled === true || filters.enabled === 'true';

            if (role.enabled !== enabled) {
                return false;
            }
        }

        return true;
    }

    _createId(items) {
        const lastId = items.reduce((highestId, item) => {
            const numericId = BigInt(`0x${item.id}`);
            return numericId > highestId ? numericId : highestId;
        }, 0n);

        return (lastId + 1n).toString(16).padStart(24, '0');
    }
}

module.exports = RoleMockService;
