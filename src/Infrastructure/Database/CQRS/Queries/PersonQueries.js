const mongoose = require('mongoose');
const { UserModel } = require('../../MernDb/dbModels');
const IPersonQueries = require('../../../../Application/Interfaces/CQRS/Queries/IPersonQueries');

class PersonQueries extends IPersonQueries {
    // Obtiene los usuarios asociados a las personas indicadas.
    async getUsersByPersonIdsQueryAsync(personIds) {
        const validPersonIds = (personIds ?? [])
            .filter(personId => mongoose.isValidObjectId(personId))
            .map(personId => (
                typeof personId === 'string'
                    ? new mongoose.Types.ObjectId(personId)
                    : personId
            ));

        if (validPersonIds.length === 0) {
            return [];
        }

        const users = await UserModel
            .find({ personId: { $in: validPersonIds } })
            .select({ _id: 1, personId: 1, username: 1 })
            .sort({ _id: 1 })
            .lean();

        return users.map(user => ({
            personId: user.personId?.toString() ?? null,
            userId: user._id.toString(),
            userName: user.username ?? null
        }));
    }
}

module.exports = PersonQueries;
