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
        return this._apiClient.GetAsync('/api/comment', {
            page,
            pageSize,
            ...filters
        });
    }

    async GetByIdAsync(id) {
        return this._apiClient.GetAsync(`/api/comment/${id}`);
    }

    async CreateAsync(createCommentDto) {
        return this._apiClient.PostAsync('/api/comment', createCommentDto);
    }

    async UpdateAsync(id, updateCommentDto) {
        return this._apiClient.PutAsync(
            `/api/comment/${id}`,
            updateCommentDto
        );
    }

    async PatchMessageAsync(id, patchCommentMessageDto) {
        return this._apiClient.PatchAsync(
            `/api/comment/${id}/message`,
            patchCommentMessageDto
        );
    }

    async HardDeleteAsync(id) {
        return this._apiClient.DeleteAsync(`/api/comment/hard/${id}`);
    }
}

export default CommentClient;
