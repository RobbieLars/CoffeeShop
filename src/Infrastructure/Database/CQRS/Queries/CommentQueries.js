// CommentQueries.js
const mongoose = require('mongoose');
const { CommentModel, UserModel } = require('../../MernDb/dbModels');
const ICommentQueries = require('../../../../Application/Interfaces/CQRS/Queries/ICommentQueries');

class CommentQueries extends ICommentQueries {
    // -----------------------------------------------------------------------------
    // getCommentsEnrichedByIdsQueryAsync:
    // Obtiene información del autor (username, foto) para un lote de comentarios.
    // -----------------------------------------------------------------------------
    async getCommentsEnrichedByIdsQueryAsync(commentIds) {
        const validIds = (commentIds ?? [])
            .filter(id => mongoose.isValidObjectId(id))
            .map(id => (typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id));

        if (validIds.length === 0) {
            return [];
        }

        const commentsWithAuthor = await CommentModel.aggregate([
            {
                $match: {
                    _id: { $in: validIds }
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    message: 1,
                    photoPublicId: 1,
                    edited: 1,
                    createdAt: 1,
                    userUsername: '$author.username',
                    userPhotoProfilePublicId: '$author.photoProfilePublicId'
                }
            }
        ]);

        return commentsWithAuthor.map(doc => ({
            id: doc._id.toString(),
            userId: doc.userId?.toString() ?? null,
            userUsername: doc.userUsername ?? '',
            userPhotoProfilePublicId: doc.userPhotoProfilePublicId ?? '',
            message: doc.message,
            photoPublicId: doc.photoPublicId,
            edited: doc.edited ?? false,
            createdAt: doc.createdAt
        }));
    }

}

module.exports = CommentQueries;
