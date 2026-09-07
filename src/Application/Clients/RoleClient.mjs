import JsonApiClient from './Common/JsonApiClient.mjs';

class RoleClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/api/role', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/api/role/${id}`);
    }

    async CreateAsync(createRoleDto) {
        return this._apiClient.PostAsync('/api/role', createRoleDto);
    }

    async UpdateAsync(id, updateRoleDto) {
        return this._apiClient.PutAsync(
            `/api/role/${id}`,
            updateRoleDto
        );
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        return this._apiClient.PatchAsync(
            `/api/role/${id}/enabled`,
            commonEnabledDto
        );
    }

    async SoftDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/role/${id}`);
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/role/hard/${id}`);
    }
}

export default RoleClient;
