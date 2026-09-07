import JsonApiClient from './Common/JsonApiClient.mjs';

class UserClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/api/user', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/api/user/${id}`);
    }

    async CreateAsync(createUserDto) {
        return this._apiClient.PostAsync('/api/user', createUserDto);
    }

    async UpdateAsync(id, updateUserDto) {
        return this._apiClient.PutAsync(
            `/api/user/${id}`,
            updateUserDto
        );
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        return this._apiClient.PatchAsync(
            `/api/user/${id}/enabled`,
            commonEnabledDto
        );
    }

    async SoftDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/user/${id}`);
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/user/hard/${id}`);
    }
}

export default UserClient;
