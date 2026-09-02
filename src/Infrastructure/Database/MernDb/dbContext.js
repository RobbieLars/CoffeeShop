// dbContext.js

const MainRepository = require('../../Repositories/MainRepository');
const MongoSearchFilterConfigs = require('../Common/MongoSearchFilterConfigs');

const {
    RoleModel,
    PersonModel,
    UserModel,
    PetModel,
    ProductModel,
    CommentModel,
    PurchaseModel,
    GiftModel
} = require('./dbModels');

const Role = require('../../../Domain/Entities/Role');
const Person = require('../../../Domain/Entities/Person');
const User = require('../../../Domain/Entities/User');
const Pet = require('../../../Domain/Entities/Pet');
const Product = require('../../../Domain/Entities/Product');
const Comment = require('../../../Domain/Entities/Comment');
const Purchase = require('../../../Domain/Entities/Purchase');
const Gift = require('../../../Domain/Entities/Gift');

// -----------------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------------
function toObjectIdString(value) {
    return value?.toString() ?? null;
}

// -----------------------------------------------------------------------------
// RoleMapper
// -----------------------------------------------------------------------------
class RoleMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Role({
            id: toObjectIdString(mongoDoc._id),
            name: mongoDoc.name,
            description: mongoDoc.description,
            enabled: mongoDoc.enabled ?? true
        });
    }

    toPersistence(roleEntity) {
        return {
            name: roleEntity.name,
            description: roleEntity.description,
            enabled: roleEntity.enabled ?? true
        };
    }
}

// -----------------------------------------------------------------------------
// PersonMapper
// -----------------------------------------------------------------------------
class PersonMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Person({
            id: toObjectIdString(mongoDoc._id),
            name: mongoDoc.name,
            secondName: mongoDoc.secondName ?? '',
            lastName: mongoDoc.lastName,
            secondLastName: mongoDoc.secondLastName ?? '',
            birthDate: mongoDoc.birthDate ?? null,
            gender: mongoDoc.gender ?? null,
            email: mongoDoc.email ?? null,
            googleFolderPersonUrl: mongoDoc.googleFolderPersonUrl ?? null
        });
    }

    toPersistence(personEntity) {
        return {
            name: personEntity.name,
            secondName: personEntity.secondName ?? '',
            lastName: personEntity.lastName,
            secondLastName: personEntity.secondLastName ?? '',
            birthDate: personEntity.birthDate ?? null,
            gender: personEntity.gender ?? null,
            email: personEntity.email ?? null,
            googleFolderPersonUrl: personEntity.googleFolderPersonUrl ?? null
        };
    }
}

// -----------------------------------------------------------------------------
// UserMapper
// -----------------------------------------------------------------------------
class UserMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new User({
            id: toObjectIdString(mongoDoc._id),
            photoProfilePublicId: mongoDoc.photoProfilePublicId ?? '',
            username: mongoDoc.username,
            verified: mongoDoc.verified ?? false,
            lockedUntil: mongoDoc.lockedUntil ?? null,
            failedLoginAttempts: mongoDoc.failedLoginAttempts ?? 0,
            personId: toObjectIdString(mongoDoc.personId),
            enabled: mongoDoc.enabled ?? true
        });
    }

    toPersistence(userEntity) {
        return {
            photoProfilePublicId: userEntity.photoProfilePublicId ?? '',
            username: userEntity.username,
            password: userEntity.password,
            verified: userEntity.verified ?? false,
            lockedUntil: userEntity.lockedUntil ?? null,
            failedLoginAttempts: userEntity.failedLoginAttempts ?? 0,
            personId: userEntity.personId,
            enabled: userEntity.enabled ?? true
        };
    }
}

// -----------------------------------------------------------------------------
// PetMapper
// -----------------------------------------------------------------------------
class PetMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Pet({
            id: toObjectIdString(mongoDoc._id),
            ownerId: toObjectIdString(mongoDoc.ownerId),
            photoPublicId: mongoDoc.photoPublicId ?? null,
            name: mongoDoc.name,
            type: mongoDoc.type,
            birthDate: mongoDoc.birthDate ?? null,
            gender: mongoDoc.gender,
            weight: mongoDoc.weight ?? null,
            favoriteFood: mongoDoc.favoriteFood ?? null,
            privacy: mongoDoc.privacy ?? true
        });
    }

    toPersistence(petEntity) {
        return {
            ownerId: petEntity.ownerId,
            photoPublicId: petEntity.photoPublicId ?? null,
            name: petEntity.name,
            type: petEntity.type,
            birthDate: petEntity.birthDate ?? null,
            gender: petEntity.gender,
            weight: petEntity.weight ?? null,
            favoriteFood: petEntity.favoriteFood ?? null,
            privacy: petEntity.privacy ?? true
        };
    }
}

// -----------------------------------------------------------------------------
// ProductMapper
// -----------------------------------------------------------------------------
class ProductMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Product({
            id: toObjectIdString(mongoDoc._id),
            name: mongoDoc.name,
            description: mongoDoc.description,
            imgPublicId: mongoDoc.imgPublicId,
            price: mongoDoc.price,
            url: mongoDoc.url,
            enabled: mongoDoc.enabled ?? true
        });
    }

    toPersistence(productEntity) {
        return {
            name: productEntity.name,
            description: productEntity.description,
            imgPublicId: productEntity.imgPublicId,
            price: productEntity.price,
            url: productEntity.url,
            enabled: productEntity.enabled ?? true
        };
    }
}

// -----------------------------------------------------------------------------
// CommentMapper
// -----------------------------------------------------------------------------
class CommentMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Comment({
            id: toObjectIdString(mongoDoc._id),
            userId: toObjectIdString(mongoDoc.userId),
            message: mongoDoc.message,
            photoPublicId: mongoDoc.photoPublicId ?? null,
            edited: mongoDoc.edited ?? false
        });
    }

    toPersistence(commentEntity) {
        return {
            userId: commentEntity.userId,
            message: commentEntity.message,
            photoPublicId: commentEntity.photoPublicId ?? null,
            edited: commentEntity.edited ?? false
        };
    }
}

// -----------------------------------------------------------------------------
// PurchaseMapper
// -----------------------------------------------------------------------------
class PurchaseMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Purchase({
            id: toObjectIdString(mongoDoc._id),
            productId: toObjectIdString(mongoDoc.productId),
            userId: toObjectIdString(mongoDoc.userId),
            petId: toObjectIdString(mongoDoc.petId),
            day: mongoDoc.day,
            photoPublicId: mongoDoc.photoPublicId ?? null
        });
    }

    toPersistence(purchaseEntity) {
        return {
            productId: purchaseEntity.productId,
            userId: purchaseEntity.userId,
            petId: purchaseEntity.petId,
            day: purchaseEntity.day,
            photoPublicId: purchaseEntity.photoPublicId ?? null
        };
    }
}

// -----------------------------------------------------------------------------
// GiftMapper
// -----------------------------------------------------------------------------
class GiftMapper {
    toDomain(mongoDoc) {
        if (!mongoDoc) return null;
        return new Gift({
            id: toObjectIdString(mongoDoc._id),
            userId: toObjectIdString(mongoDoc.userId),
            productId: toObjectIdString(mongoDoc.productId),
            petId: toObjectIdString(mongoDoc.petId),
            date: mongoDoc.date,
            giftReceived: mongoDoc.giftReceived ?? false,
            googlePhotoPetUrl: mongoDoc.googlePhotoPetUrl ?? null,
            googleFolderPetUrl: mongoDoc.googleFolderPetUrl ?? null
        });
    }

    toPersistence(giftEntity) {
        return {
            userId: giftEntity.userId,
            productId: giftEntity.productId,
            petId: giftEntity.petId,
            date: giftEntity.date,
            giftReceived: giftEntity.giftReceived ?? false,
            googlePhotoPetUrl: giftEntity.googlePhotoPetUrl ?? null,
            googleFolderPetUrl: giftEntity.googleFolderPetUrl ?? null
        };
    }
}

// -----------------------------------------------------------------------------
// StoreDbContext
// -----------------------------------------------------------------------------
class StoreDbContext {
    constructor() {
        this.roles = new MainRepository(RoleModel, new RoleMapper());
        this.people = new MainRepository(PersonModel, new PersonMapper());
        this.users = new MainRepository(UserModel, new UserMapper());
        this.pets = new MainRepository(
            PetModel,
            new PetMapper(),
            MongoSearchFilterConfigs.pet
        );
        this.products = new MainRepository(ProductModel, new ProductMapper());
        this.comments = new MainRepository(
            CommentModel,
            new CommentMapper(),
            MongoSearchFilterConfigs.comment
        );
        this.purchases = new MainRepository(
            PurchaseModel,
            new PurchaseMapper(),
            MongoSearchFilterConfigs.purchase
        );
        this.gifts = new MainRepository(
            GiftModel,
            new GiftMapper(),
            MongoSearchFilterConfigs.gift
        );
    }
}

module.exports = StoreDbContext;
