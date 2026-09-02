const mongoose = require('mongoose');
const { UserModel } = require('../../MernDb/dbModels');
const IPetQueries = require('../../../../Application/Interfaces/CQRS/Queries/IPetQueries');

class PetQueries extends IPetQueries {
    // Obtiene los usuarios que pueden ser propietarios de una mascota.
    async getOwnersByIdsQueryAsync(ownerIds) {
        const validOwnerIds = (ownerIds ?? [])
            .filter(ownerId => mongoose.isValidObjectId(ownerId))
            .map(ownerId => (
                typeof ownerId === 'string'
                    ? new mongoose.Types.ObjectId(ownerId)
                    : ownerId
            ));

        if (validOwnerIds.length === 0) {
            return [];
        }

        const owners = await UserModel
            .find({ _id: { $in: validOwnerIds } })
            .select({ _id: 1, username: 1 })
            .lean();

        return owners.map(owner => ({
            ownerId: owner._id.toString(),
            ownerName: owner.username ?? null
        }));
    }
}

module.exports = PetQueries;
