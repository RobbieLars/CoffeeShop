import JsonApiClient from './Common/JsonApiClient.mjs';

class PersonClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/api/person', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/api/person/${id}`);
    }

    async CreateAsync(createPersonDto) {
        return this._apiClient.PostAsync('/api/person', createPersonDto);
    }

    async UpdateAsync(id, updatePersonDto) {
        return this._apiClient.PutAsync(
            `/api/person/${id}`,
            updatePersonDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/person/${id}`);
    }
}

export default PersonClient;
