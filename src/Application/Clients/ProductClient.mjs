import JsonApiClient from './Common/JsonApiClient.mjs';

class ProductClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/product', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/product/${id}`);
    }

    async CreateAsync(createProductDto) {
        return this._apiClient.PostAsync('/product', createProductDto);
    }

    async UpdateAsync(id, updateProductDto) {
        return this._apiClient.PutAsync(
            `/product/${id}`,
            updateProductDto
        );
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        return this._apiClient.PatchAsync(
            `/product/${id}/enabled`,
            commonEnabledDto
        );
    }

    async SoftDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/product/${id}`);
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/product/hard/${id}`);
    }
}

export default ProductClient;
