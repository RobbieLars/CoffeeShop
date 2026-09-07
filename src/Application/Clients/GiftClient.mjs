import JsonApiClient from './Common/JsonApiClient.mjs';

class GiftClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/api/gift', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/api/gift/${id}`);
    }

    async CreateAsync(createGiftDto) {
        return this._apiClient.PostAsync('/api/gift', createGiftDto);
    }

    async UpdateAsync(id, updateGiftDto) {
        return this._apiClient.PutAsync(
            `/api/gift/${id}`,
            updateGiftDto
        );
    }

    async PatchReceivedAsync(id, updateReceivedDto) {
        return this._apiClient.PatchAsync(
            `/api/gift/${id}/received`,
            updateReceivedDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/gift/${id}`);
    }
}

export default GiftClient;
