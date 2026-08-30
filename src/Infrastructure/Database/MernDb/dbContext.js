const MainRepository = require('../../Repositories/MainRepository');

const {
    RoleModel,
    PersonModel,
    UserModel,
    ProductModel,
    CommentModel,
    PurchaseModel
} = require('./dbModels');

const Role = require('../../../Domain/Entities/Role');
const Person = require('../../../Domain/Entities/Person');
const User = require('../../../Domain/Entities/User');
const Product = require('../../../Domain/Entities/Product');
const Comment = require('../../../Domain/Entities/Comment');
const Purchase = require('../../../Domain/Entities/Purchase');


// -----------------------------------------------------------------------------
// Common
// -----------------------------------------------------------------------------

function toObjectIdString(value) {
    return value?.toString() ?? null;
}


// -----------------------------------------------------------------------------
// Security mappings
// -----------------------------------------------------------------------------

class RoleMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new Role({
            id: toObjectIdString(mongoDoc._id),
            name: mongoDoc.name,
            description: mongoDoc.description,
            enabled: mongoDoc.enabled ?? true,

            createdById: toObjectIdString(mongoDoc.createdById),
            modifiedById: toObjectIdString(mongoDoc.modifiedById)
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
// Person mappings
// -----------------------------------------------------------------------------

class PersonMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new Person({
            id: toObjectIdString(mongoDoc._id),

            name: mongoDoc.name,
            secondName: mongoDoc.secondName ?? '',
            lastName: mongoDoc.lastName,
            secondLastName: mongoDoc.secondLastName ?? ''
        });
    }

    toPersistence(personEntity) {
        return {
            name: personEntity.name,
            secondName: personEntity.secondName ?? '',
            lastName: personEntity.lastName,
            secondLastName: personEntity.secondLastName ?? ''
        };
    }
}


// -----------------------------------------------------------------------------
// User mappings
// -----------------------------------------------------------------------------

class UserMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new User({
            id: toObjectIdString(mongoDoc._id),

            photoProfilePublicId:
                mongoDoc.photoProfilePublicId ?? '',

            username: mongoDoc.username,

            email: mongoDoc.email ?? null,

            verified: mongoDoc.verified ?? false,

            lockedUntil: mongoDoc.lockedUntil ?? null,

            failedLoginAttempts:
                mongoDoc.failedLoginAttempts ?? 0,

            personId:
                toObjectIdString(mongoDoc.personId),

            enabled:
                mongoDoc.enabled ?? true,

            createdById:
                toObjectIdString(mongoDoc.createdById),

            modifiedById:
                toObjectIdString(mongoDoc.modifiedById)
        });
    }

    toDomainWithPassword(mongoDoc) {
        if (!mongoDoc) return null;

        return new User({
            ...this.toDomain(mongoDoc),
            password: mongoDoc.password
        });
    }

    toPersistence(userEntity) {
        return {
            photoProfilePublicId:
                userEntity.photoProfilePublicId ?? '',

            username:
                userEntity.username,

            email:
                userEntity.email ?? null,

            password:
                userEntity.password,

            verified:
                userEntity.verified ?? false,

            lockedUntil:
                userEntity.lockedUntil ?? null,

            failedLoginAttempts:
                userEntity.failedLoginAttempts ?? 0,

            personId:
                userEntity.personId,

            enabled:
                userEntity.enabled ?? true
        };
    }
}


// -----------------------------------------------------------------------------
// Product mappings
// -----------------------------------------------------------------------------

class ProductMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new Product({
            id: toObjectIdString(mongoDoc._id),

            name:
                mongoDoc.name,

            description:
                mongoDoc.description,

            imgPublicId:
                mongoDoc.imgPublicId,

            price:
                Number(mongoDoc.price),

            url:
                mongoDoc.url,

            enabled:
                mongoDoc.enabled ?? true,

            createdById:
                toObjectIdString(mongoDoc.createdById),

            modifiedById:
                toObjectIdString(mongoDoc.modifiedById)
        });
    }

    toPersistence(productEntity) {
        return {
            name:
                productEntity.name,

            description:
                productEntity.description,

            imgPublicId:
                productEntity.imgPublicId,

            price:
                Number(productEntity.price),

            url:
                productEntity.url,

            enabled:
                productEntity.enabled ?? true
        };
    }
}


// -----------------------------------------------------------------------------
// Comment mappings
// -----------------------------------------------------------------------------

class CommentMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new Comment({
            id: toObjectIdString(mongoDoc._id),

            userId:
                toObjectIdString(mongoDoc.userId),

            message:
                mongoDoc.message,

            photoPublicId:
                mongoDoc.photoPublicId ?? null,

            createdById:
                toObjectIdString(mongoDoc.createdById),

            modifiedById:
                toObjectIdString(mongoDoc.modifiedById)
        });
    }

    toPersistence(commentEntity) {
        return {
            userId:
                commentEntity.userId,

            message:
                commentEntity.message,

            photoPublicId:
                commentEntity.photoPublicId ?? null
        };
    }
}


// -----------------------------------------------------------------------------
// Purchase mappings
// -----------------------------------------------------------------------------

class PurchaseMapper {

    toDomain(mongoDoc) {
        if (!mongoDoc) return null;

        return new Purchase({
            id: toObjectIdString(mongoDoc._id),

            productId:
                toObjectIdString(mongoDoc.productId),

            userId:
                toObjectIdString(mongoDoc.userId),

            day:
                mongoDoc.day,

            photoPublicId:
                mongoDoc.photoPublicId ?? null,

            createdById:
                toObjectIdString(mongoDoc.createdById),

            modifiedById:
                toObjectIdString(mongoDoc.modifiedById)
        });
    }

    toPersistence(purchaseEntity) {
        return {
            productId:
                purchaseEntity.productId,

            userId:
                purchaseEntity.userId,

            day:
                purchaseEntity.day,

            photoPublicId:
                purchaseEntity.photoPublicId ?? null
        };
    }
}


// -----------------------------------------------------------------------------
// StoreDb context
// -----------------------------------------------------------------------------

class StoreDbContext {

    constructor() {

        this.roles = new MainRepository(
            RoleModel,
            new RoleMapper()
        );

        this.people = new MainRepository(
            PersonModel,
            new PersonMapper()
        );

        this.users = new MainRepository(
            UserModel,
            new UserMapper()
        );

        this.products = new MainRepository(
            ProductModel,
            new ProductMapper()
        );

        this.comments = new MainRepository(
            CommentModel,
            new CommentMapper()
        );

        this.purchases = new MainRepository(
            PurchaseModel,
            new PurchaseMapper()
        );
    }
}


module.exports = StoreDbContext;