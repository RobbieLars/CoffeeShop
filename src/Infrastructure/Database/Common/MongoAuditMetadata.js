// Extrae los timestamps y actores de auditoría de documentos MongoDB.
const { UserModel } = require('../MernDb/dbModels');

class MongoAuditMetadata {
    static fromDocument(mongoDoc) {
        return {
            createdAt: mongoDoc?.createdAt ?? null,
            updatedAt: mongoDoc?.updatedAt ?? null
        };
    }

    static async fromDocumentWithUserAsync(mongoDoc) {
        const auditMetadata = this.fromDocument(mongoDoc);
        const createdById = mongoDoc?.createdById ?? null;
        const modifiedById = mongoDoc?.modifiedById ?? null;
        const userIds = [...new Set(
            [createdById, modifiedById]
                .filter(Boolean)
                .map(userId => userId.toString())
        )];

        if (userIds.length === 0) {
            return {
                createdByUserName: null,
                ...auditMetadata,
                updatedByUserName: null
            };
        }

        const users = await UserModel
            .find({ _id: { $in: userIds } })
            .select('_id username')
            .lean();

        const usernameByUserId = new Map(
            users.map(user => [user._id.toString(), user.username])
        );

        return {
            createdByUserName: createdById
                ? usernameByUserId.get(createdById.toString()) ?? null
                : null,
            createdAt: auditMetadata.createdAt,
            updatedByUserName: modifiedById
                ? usernameByUserId.get(modifiedById.toString()) ?? null
                : null,
            updatedAt: auditMetadata.updatedAt
        };
    }
}

module.exports = MongoAuditMetadata;
