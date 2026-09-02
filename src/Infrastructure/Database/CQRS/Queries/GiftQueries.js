const mongoose = require('mongoose');
const {
    UserModel,
    ProductModel,
    PetModel
} = require('../../MernDb/dbModels');
const IGiftQueries = require('../../../../Application/Interfaces/CQRS/Queries/IGiftQueries');

function getValidObjectIds(ids) {
    return [...new Set(ids ?? [])]
        .filter(id => mongoose.isValidObjectId(id))
        .map(id => (
            typeof id === 'string'
                ? new mongoose.Types.ObjectId(id)
                : id
        ));
}

class GiftQueries extends IGiftQueries {
    async getGiftReferencesByIdsQueryAsync({
        userIds,
        productIds,
        petIds
    } = {}) {
        const validUserIds = getValidObjectIds(userIds);
        const validProductIds = getValidObjectIds(productIds);
        const validPetIds = getValidObjectIds(petIds);

        const [users, products, pets] = await Promise.all([
            UserModel
                .find({ _id: { $in: validUserIds } })
                .select({ _id: 1, username: 1 })
                .lean(),
            ProductModel
                .find({ _id: { $in: validProductIds } })
                .select({ _id: 1, name: 1, imgPublicId: 1 })
                .lean(),
            PetModel
                .find({ _id: { $in: validPetIds } })
                .select({ _id: 1, name: 1 })
                .lean()
        ]);

        return {
            users: users.map(user => ({
                userId: user._id.toString(),
                userName: user.username ?? null
            })),
            products: products.map(product => ({
                productId: product._id.toString(),
                productName: product.name ?? null,
                productImgPublicId: product.imgPublicId ?? null
            })),
            pets: pets.map(pet => ({
                petId: pet._id.toString(),
                petName: pet.name ?? null
            }))
        };
    }
}

module.exports = GiftQueries;
