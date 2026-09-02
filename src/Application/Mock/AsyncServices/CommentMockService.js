const PagedResultDto = require('@coffeeshop/common/DTOs/PagedResultDto');
const PaginationDto = require('@coffeeshop/common/DTOs/PaginationDto');

const {
    NotFoundError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

const {
    CreateCommentDto,
    UpdateCommentDto,
    PatchCommentMessageDto,
    CommentListItemDto,
    CommentDetailDto
} = require('../../DTOs/CommentDto');

const ICommentMockData = require('../Data/ICommentMockData');

// Servicio de Comment respaldado por datos simulados.
// Expone el mismo contrato asíncrono que CommentService sin usar CQRS,
// repositorios ni dependencias de infraestructura.
class CommentMockService {
    constructor(commentMockData = new ICommentMockData()) {
        this._commentMockData = commentMockData;
    }

    async GetPagedAsync(paginationData = {}) {
        const pagination = paginationData instanceof PaginationDto
            ? paginationData
            : new PaginationDto(paginationData);

        const filters = paginationData?.filters ?? {};

        const filteredItems = this._commentMockData
            .GetItems()
            .filter(item => this._matchesFilters(item, filters));

        const startIndex = (pagination.page - 1) * pagination.pageSize;

        const items = filteredItems
            .slice(startIndex, startIndex + pagination.pageSize)
            .map(item => new CommentListItemDto({
                id: item.id,
                userId: item.userId,
                userUsername: item.userUsername,
                userPhotoProfilePublicId: item.userPhotoProfilePublicId,
                message: item.message,
                photoPublicId: item.photoPublicId,
                edited: item.edited,
                createdAt: null,
                actions: []
            }));

        return new PagedResultDto({
            items,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: filteredItems.length
        });
    }

    async GetByIdAsync(id) {
        return this._getRequiredComment(id);
    }

    async CreateAsync(createCommentDto) {
        const dto = createCommentDto instanceof CreateCommentDto
            ? createCommentDto
            : new CreateCommentDto(createCommentDto);

        const items = this._commentMockData.GetItems();

        const createdComment = new CommentDetailDto({
            id: this._createId(items),
            userId: dto.userId,
            userUsername: '',
            userPhotoProfilePublicId: '',
            message: dto.message,
            photoPublicId: dto.photoPublicId ?? null,
            edited: false
        });

        this._commentMockData.ReplaceItems([
            ...items,
            createdComment
        ]);

        return new CommentDetailDto(createdComment);
    }

    async UpdateAsync(id, updateCommentDto) {
        const dto = updateCommentDto instanceof UpdateCommentDto
            ? updateCommentDto
            : new UpdateCommentDto(updateCommentDto);

        const items = this._commentMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Comentario (${id}) no encontrado.`
            );
        }

        const currentComment = items[itemIndex];

        const updatedComment = new CommentDetailDto({
            id: currentComment.id,

            userId: dto.userId ?? currentComment.userId,

            userUsername: currentComment.userUsername,

            userPhotoProfilePublicId:
                currentComment.userPhotoProfilePublicId,

            message: dto.message ?? currentComment.message,

            photoPublicId: dto.photoPublicId === undefined
                ? currentComment.photoPublicId
                : dto.photoPublicId,

            edited: true,

            audit: currentComment.audit
        });

        items[itemIndex] = updatedComment;

        this._commentMockData.ReplaceItems(items);

        return new CommentDetailDto(updatedComment);
    }

    async PatchMessageAsync(id, patchCommentMessageDto) {
        const dto = patchCommentMessageDto instanceof PatchCommentMessageDto
            ? patchCommentMessageDto
            : new PatchCommentMessageDto(patchCommentMessageDto);

        const items = this._commentMockData.GetItems();

        const itemIndex = items.findIndex(
            item => item.id === id
        );

        if (itemIndex < 0) {
            throw new NotFoundError(
                `Comentario (${id}) no encontrado.`
            );
        }

        const currentComment = items[itemIndex];

        const updatedComment = new CommentDetailDto({
            id: currentComment.id,
            userId: currentComment.userId,
            userUsername: currentComment.userUsername,
            userPhotoProfilePublicId:
                currentComment.userPhotoProfilePublicId,

            message: dto.message,

            photoPublicId: currentComment.photoPublicId,
            edited: true,
            audit: currentComment.audit
        });

        items[itemIndex] = updatedComment;

        this._commentMockData.ReplaceItems(items);

        return new CommentDetailDto(updatedComment);
    }

    async HardDeleteAsync(id) {
        const comment = this._getRequiredComment(id);

        const remainingItems = this._commentMockData
            .GetItems()
            .filter(item => item.id !== id);

        this._commentMockData.ReplaceItems(remainingItems);

        return new CommentDetailDto(comment);
    }

    _getRequiredComment(id) {
        const comment = this._commentMockData
            .GetItems()
            .find(item => item.id === id);

        if (!comment) {
            throw new NotFoundError(
                `Comentario (${id}) no encontrado.`
            );
        }

        return new CommentDetailDto(comment);
    }

    _matchesFilters(comment, filters) {
        if (filters.userId) {
            if (comment.userId !== filters.userId) {
                return false;
            }
        }

        if (filters.userUsername) {
            const userUsername = String(filters.userUsername)
                .trim()
                .toLowerCase();

            if (
                !String(comment.userUsername)
                    .toLowerCase()
                    .includes(userUsername)
            ) {
                return false;
            }
        }

        if (filters.message) {
            const message = String(filters.message)
                .trim()
                .toLowerCase();

            if (
                !String(comment.message)
                    .toLowerCase()
                    .includes(message)
            ) {
                return false;
            }
        }

        if (
            filters.edited !== undefined &&
            filters.edited !== ''
        ) {
            const edited =
                filters.edited === true ||
                filters.edited === 'true';

            if (comment.edited !== edited) {
                return false;
            }
        }

        return true;
    }

    _createId(items) {
        const lastId = items.reduce(
            (highestId, item) => {
                const numericId = BigInt(`0x${item.id}`);

                return numericId > highestId
                    ? numericId
                    : highestId;
            },
            0n
        );

        return (lastId + 1n)
            .toString(16)
            .padStart(24, '0');
    }
}

module.exports = CommentMockService;