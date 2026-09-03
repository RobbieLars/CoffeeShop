import JsonApiClient from './Common/JsonApiClient.mjs';

class PetClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/pet', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/pet/${id}`);
    }

    async CreateAsync(createPetDto) {
        return this._apiClient.PostAsync('/pet', createPetDto);
    }

    async UpdateAsync(id, updatePetDto) {
        return this._apiClient.PutAsync(
            `/pet/${id}`,
            updatePetDto
        );
    }

    async PatchOwnerAsync(id, patchPetOwnerDto) {
        return this._apiClient.PatchAsync(
            `/pet/${id}/owner`,
            patchPetOwnerDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/pet/hard/${id}`);
    }
}

export default PetClient;
