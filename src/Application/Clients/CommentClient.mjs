import JsonApiClient from './Common/JsonApiClient.mjs';

class CommentClient {
    constructor({ baseUrl, apiClient = null } = {}) {
        this._apiClient = apiClient ?? new JsonApiClient({ baseUrl });
    }

    async GetPagedAsync({
        page = 1,
        pageSize = 5,
        filters = {}
    } = {}) {
        return this._apiClient.GetAsync('/comment', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/comment/${id}`);
    }

    async CreateAsync(createCommentDto) {
        return this._apiClient.PostAsync('/comment', createCommentDto);
    }

    async UpdateAsync(id, updateCommentDto) {
        return this._apiClient.PutAsync(
            `/comment/${id}`,
            updateCommentDto
        );
    }

    async PatchMessageAsync(id, patchCommentMessageDto) {
        return this._apiClient.PatchAsync(
            `/comment/${id}/message`,
            patchCommentMessageDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/comment/hard/${id}`);
    }
}

export default CommentClient;
