import JsonApiClient from './Common/JsonApiClient.mjs';

class PurchaseClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/purchase', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/purchase/${id}`);
    }

    async CreateAsync(createPurchaseDto) {
        return this._apiClient.PostAsync('/purchase', createPurchaseDto);
    }

    async UpdateAsync(id, updatePurchaseDto) {
        return this._apiClient.PutAsync(
            `/purchase/${id}`,
            updatePurchaseDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/purchase/${id}`);
    }
}

export default PurchaseClient;
