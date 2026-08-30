const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const { buildExistsValidator } = require('../Common/MongooseValidation');


// -----------------------------------------------------------------------------
// Common
// -----------------------------------------------------------------------------

function buildActorAuditFields() {
    return {
        createdById: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        modifiedById: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    };
}


// -----------------------------------------------------------------------------
// Security: Role
// -----------------------------------------------------------------------------

const roleSchema = new Schema({
    ...buildActorAuditFields(),

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    enabled: {
        type: Boolean,
        required: true,
        default: true
    }

}, {
    timestamps: true
});

const RoleModel = model(
    'Role',
    roleSchema,
    'Role'
);


// -----------------------------------------------------------------------------
// Person
// -----------------------------------------------------------------------------

const personSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    secondName: {
        type: String,
        default: '',
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    secondLastName: {
        type: String,
        default: '',
        trim: true
    }

}, {
    timestamps: true
});

const PersonModel = model(
    'Person',
    personSchema,
    'Person'
);


// -----------------------------------------------------------------------------
// Security: User
// -----------------------------------------------------------------------------

const userSchema = new Schema({
    ...buildActorAuditFields(),

    photoProfilePublicId: {
        type: String,
        default: '',
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        default: null,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    verified: {
        type: Boolean,
        required: true,
        default: false
    },

    lockedUntil: {
        type: Date,
        default: null
    },

    failedLoginAttempts: {
        type: Number,
        required: true,
        default: 0
    },

    personId: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true,
        validate: buildExistsValidator(
            PersonModel,
            'El personId no existe en la coleccion Person.'
        )
    },

    enabled: {
        type: Boolean,
        required: true,
        default: true
    }

}, {
    timestamps: true
});

const UserModel = model(
    'User',
    userSchema,
    'User'
);


// -----------------------------------------------------------------------------
// Store: Product
// -----------------------------------------------------------------------------

const productSchema = new Schema({
    ...buildActorAuditFields(),

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    imgPublicId: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    url: {
        type: String,
        required: true,
        trim: true
    },

    enabled: {
        type: Boolean,
        required: true,
        default: true
    }

}, {
    timestamps: true
});

const ProductModel = model(
    'Product',
    productSchema,
    'Product'
);


// -----------------------------------------------------------------------------
// Store: Comment
// -----------------------------------------------------------------------------

const commentSchema = new Schema({
    ...buildActorAuditFields(),

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: buildExistsValidator(
            UserModel,
            'El userId no existe en la coleccion User.'
        )
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    photoPublicId: {
        type: String,
        default: null,
        trim: true
    }

}, {
    timestamps: true
});

const CommentModel = model(
    'Comment',
    commentSchema,
    'Comment'
);


// -----------------------------------------------------------------------------
// Store: Purchase
// -----------------------------------------------------------------------------

const purchaseSchema = new Schema({
    ...buildActorAuditFields(),

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: buildExistsValidator(
            ProductModel,
            'El productId no existe en la coleccion Product.'
        )
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: buildExistsValidator(
            UserModel,
            'El userId no existe en la coleccion User.'
        )
    },

    day: {
        type: Date,
        required: true,
        default: Date.now
    },

    photoPublicId: {
        type: String,
        default: null,
        trim: true
    }

}, {
    timestamps: true
});

const PurchaseModel = model(
    'Purchase',
    purchaseSchema,
    'Purchase'
);


// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
    RoleModel,
    PersonModel,
    UserModel,
    ProductModel,
    CommentModel,
    PurchaseModel
};