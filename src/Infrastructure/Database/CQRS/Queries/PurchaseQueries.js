const mongoose = require('mongoose');
const {
    ProductModel,
    UserModel,
    PetModel
} = require('../../MernDb/dbModels');
const IPurchaseQueries = require('../../../../Application/Interfaces/CQRS/Queries/IPurchaseQueries');

function getValidObjectIds(ids) {
    return [...new Set(ids ?? [])]
        .filter(id => mongoose.isValidObjectId(id))
        .map(id => (
            typeof id === 'string'
                ? new mongoose.Types.ObjectId(id)
                : id
        ));
}

class PurchaseQueries extends IPurchaseQueries {
    async getPurchaseReferencesByIdsQueryAsync({
        productIds,
        userIds,
        petIds
    } = {}) {
        const validProductIds = getValidObjectIds(productIds);
        const validUserIds = getValidObjectIds(userIds);
        const validPetIds = getValidObjectIds(petIds);

        const [products, users, pets] = await Promise.all([
            ProductModel
                .find({ _id: { $in: validProductIds } })
                .select({ _id: 1, name: 1 })
                .lean(),
            UserModel
                .find({ _id: { $in: validUserIds } })
                .select({ _id: 1, username: 1 })
                .lean(),
            PetModel
                .find({ _id: { $in: validPetIds } })
                .select({ _id: 1, name: 1 })
                .lean()
        ]);

        return {
            products: products.map(product => ({
                productId: product._id.toString(),
                productName: product.name ?? null
            })),
            users: users.map(user => ({
                userId: user._id.toString(),
                userName: user.username ?? null
            })),
            pets: pets.map(pet => ({
                petId: pet._id.toString(),
                petName: pet.name ?? null
            }))
        };
    }
}

module.exports = PurchaseQueries;
