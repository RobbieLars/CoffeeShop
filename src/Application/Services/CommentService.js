// CommentService.js

const {
    CommentListItemDto,
    CommentDetailDto,
    CreateCommentDto,
    UpdateCommentDto,
    PatchCommentMessageDto,
    UserCommentsDeleteImpactDto
} = require('../DTOs/CommentDto');

const Comment = require('../../Domain/Entities/Comment');

const {
    CreateCommentDtoValidator,
    UpdateCommentDtoValidator,
    PatchCommentMessageDtoValidator
} = require('../Validators/Service/CommentDtoValidator');

const ICommentQueries = require('../Interfaces/CQRS/Queries/ICommentQueries');
const ICommentCommands = require('../Interfaces/CQRS/Commands/ICommentCommands');

const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

const {
    ValidationError,
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class CommentService {
    constructor(commentRepository, commentQueries, commentCommands, paginationService) {
        this._commentRepository = commentRepository;
        this._paginationService = paginationService;

        if (!(commentQueries instanceof ICommentQueries)) {
            throw new Error('commentQueries debe implementar ICommentQueries');
        }

        if (!(commentCommands instanceof ICommentCommands)) {
            throw new Error('commentCommands debe implementar ICommentCommands');
        }

        this._commentQueries = commentQueries;
        this._commentCommands = commentCommands;

        this._createCommentDtoValidator = new CreateCommentDtoValidator();
        this._updateCommentDtoValidator = new UpdateCommentDtoValidator();
        this._patchCommentMessageDtoValidator = new PatchCommentMessageDtoValidator();
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync: Obtiene todos los comentarios paginados y enriquecidos con CQRS
    // -----------------------------------------------------------------------------
    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._commentRepository,
            paginationData,
            commentEntity => commentEntity,
            searchCriteria,
            commentEntities => this._toCommentListItemDtosAsync(commentEntities)
        );
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync: Obtiene un comentario por su ID
    // -----------------------------------------------------------------------------
    async GetByIdAsync(id) {
        const commentId = validateRequiredObjectId(id, 'id');

        const commentEntity =
            await this._commentRepository.getByIdWithAuditAsync(commentId);

        if (!commentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        const enrichedList = await this._commentQueries.getCommentsEnrichedByIdsQueryAsync([commentId]);
        const enrichedData = enrichedList[0];

        return this._toCommentDetailDto(
            commentEntity.entity,
            commentEntity.audit,
            enrichedData
        );
    }

    // -----------------------------------------------------------------------------
    // GetByUserIdAsync: Obtiene todos los comentarios de un usuario específico
    // -----------------------------------------------------------------------------
    async GetByUserIdAsync(userId) {
        const validUserId = validateRequiredObjectId(userId, 'userId');
        return await this._commentQueries.getCommentsByUserIdQueryAsync(validUserId);
    }

    // -----------------------------------------------------------------------------
    // GetUserCommentsDeleteImpactAsync: Impacto antes de eliminar un usuario
    // -----------------------------------------------------------------------------
    async GetUserCommentsDeleteImpactAsync(userId) {
        const validUserId = validateRequiredObjectId(userId, 'userId');
        const impact = await this._commentQueries.getUserCommentsDeleteImpactQueryAsync(validUserId);
        return new UserCommentsDeleteImpactDto(impact);
    }

    // -----------------------------------------------------------------------------
    // CreateAsync: Crea un nuevo comentario (edited = false)
    // -----------------------------------------------------------------------------
    async CreateAsync(createCommentDto) {
        const dto = createCommentDto instanceof CreateCommentDto
            ? createCommentDto
            : new CreateCommentDto(createCommentDto);

        const validationErrors =
            this._createCommentDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const commentEntity = new Comment({
            userId: dto.userId,
            message: normalizeText(dto.message),
            photoPublicId: dto.photoPublicId ?? null,
            edited: false,
            enabled: true
        });

        const createdCommentEntity =
            await this._commentRepository.createAsync(commentEntity);

        return this._toCommentDetailDto(createdCommentEntity);
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync: Actualiza un comentario (marca edited = true)
    // -----------------------------------------------------------------------------
    async UpdateAsync(id, updateCommentDto) {
        const commentId = validateRequiredObjectId(id, 'id');

        const dto = updateCommentDto instanceof UpdateCommentDto
            ? updateCommentDto
            : new UpdateCommentDto(updateCommentDto);

        const validationErrors =
            this._updateCommentDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingCommentEntity =
            await this._commentRepository.getByIdAsync(commentId);

        if (!existingCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        const commentEntity = new Comment({
            id: commentId,

            userId: resolveUpdateValue(
                dto.userId,
                existingCommentEntity.userId
            ),

            message: resolveUpdateValue(
                dto.message,
                existingCommentEntity.message,
                normalizeText
            ),

            photoPublicId: dto.photoPublicId === undefined
                ? existingCommentEntity.photoPublicId
                : dto.photoPublicId,

            edited: true,

            enabled: resolveUpdateValue(
                dto.enabled,
                existingCommentEntity.enabled
            )
        });

        const updatedCommentEntity =
            await this._commentRepository.updateByIdAsync(
                commentId,
                commentEntity
            );

        if (!updatedCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        return this._toCommentDetailDto(updatedCommentEntity);
    }

    // -----------------------------------------------------------------------------
    // PatchMessageAsync: Actualiza solo el texto del mensaje (marca edited = true)
    // -----------------------------------------------------------------------------
    async PatchMessageAsync(id, patchCommentMessageDto) {
        const commentId = validateRequiredObjectId(id, 'id');

        const dto = patchCommentMessageDto instanceof PatchCommentMessageDto
            ? patchCommentMessageDto
            : new PatchCommentMessageDto(patchCommentMessageDto);

        const validationErrors =
            this._patchCommentMessageDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingCommentEntity =
            await this._commentRepository.getByIdAsync(commentId);

        if (!existingCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        const normalizedMessage = normalizeText(dto.message);

        const updatedCommentEntity =
            await this._commentRepository.patchByIdAsync(
                commentId,
                {
                    message: normalizedMessage,
                    edited: true
                }
            );

        if (!updatedCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        return this._toCommentDetailDto(updatedCommentEntity);
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync: Inhabilita un comentario
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(id) {
        const commentId = validateRequiredObjectId(id, 'id');

        const existingCommentEntity =
            await this._commentRepository.getByIdAsync(commentId);

        if (!existingCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        if (existingCommentEntity.enabled === false) {
            throw new ConflictError('El Comentario ya está inhabilitado.');
        }

        const updatedCommentEntity =
            await this._commentRepository.patchByIdAsync(
                commentId,
                { enabled: false }
            );

        if (!updatedCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        return this._toCommentDetailDto(updatedCommentEntity);
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync: Elimina permanentemente un comentario
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(id) {
        const commentId = validateRequiredObjectId(id, 'id');

        const deletedCommentEntity =
            await this._commentRepository.deleteByIdAsync(commentId);

        if (!deletedCommentEntity) {
            throw new NotFoundError(
                `Comentario (${commentId}) no encontrado.`
            );
        }

        return this._toCommentDetailDto(deletedCommentEntity);
    }

    // -----------------------------------------------------------------------------
    // Mappers & Helpers
    // -----------------------------------------------------------------------------
    async _toCommentListItemDtosAsync(commentEntities) {
        const commentIds = commentEntities.map(
            c => c.id ?? c._id?.toString?.()
        );

        const enrichedList = await this._commentQueries.getCommentsEnrichedByIdsQueryAsync(commentIds);
        const enrichedMap = new Map(enrichedList.map(e => [e.id, e]));

        return commentEntities.map(commentEntity => {
            const id = commentEntity.id ?? commentEntity._id?.toString?.();
            const enriched = enrichedMap.get(id);

            return new CommentListItemDto({
                id,
                userId: commentEntity.userId,
                userUsername: enriched?.userUsername ?? '',
                userPhotoProfilePublicId: enriched?.userPhotoProfilePublicId ?? '',
                message: commentEntity.message,
                photoPublicId: commentEntity.photoPublicId,
                edited: commentEntity.edited ?? false,
                enabled: commentEntity.enabled ?? true,
                createdAt: enriched?.createdAt ?? null
            });
        });
    }

    _toCommentDetailDto(commentEntity, audit = null, enrichedData = null) {
        return new CommentDetailDto({
            id: commentEntity.id,
            userId: commentEntity.userId,
            userUsername: enrichedData?.userUsername ?? '',
            userPhotoProfilePublicId: enrichedData?.userPhotoProfilePublicId ?? '',
            message: commentEntity.message,
            photoPublicId: commentEntity.photoPublicId,
            edited: commentEntity.edited ?? false,
            enabled: commentEntity.enabled ?? true,
            audit
        });
    }
}

module.exports = CommentService;
