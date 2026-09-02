// CommentCommands.js
const mongoose = require('mongoose');
const { CommentModel } = require('../../MernDb/dbModels');
const ICommentCommands = require('../../../../Application/Interfaces/CQRS/Commands/ICommentCommands');

class CommentCommands extends ICommentCommands {
    // -----------------------------------------------------------------------------
    // deleteCommentsByUserIdCommandAsync:
    // Elimina físicamente todos los comentarios de un usuario.
    // -----------------------------------------------------------------------------
    async deleteCommentsByUserIdCommandAsync(userId) {
        if (!mongoose.isValidObjectId(userId)) {
            return { deletedCount: 0 };
        }

        const result = await CommentModel.deleteMany({
            userId: new mongoose.Types.ObjectId(userId)
        });

        return {
            deletedCount: result.deletedCount ?? 0
        };
    }

}

module.exports = CommentCommands;
