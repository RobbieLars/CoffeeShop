// dbModels.js

const { Schema, model } = require('mongoose');
const { buildExistsValidator } = require('../Common/MongooseValidation');

// -----------------------------------------------------------------------------
// Role Schema
// -----------------------------------------------------------------------------
const roleSchema = new Schema({
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

const RoleModel = model('Role', roleSchema, 'Role');

// -----------------------------------------------------------------------------
// Person Schema
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
    },
    birthDate: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        default: null,
        trim: true
    },
    email: {
        type: String,
        default: null,
        trim: true,
        lowercase: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const PersonModel = model('Person', personSchema, 'Person');

// -----------------------------------------------------------------------------
// User Schema
// -----------------------------------------------------------------------------
const userSchema = new Schema({
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
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    lockedUntil: {
        type: Date,
        default: null
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    personId: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true,
        validate: buildExistsValidator(
            PersonModel,
            'El personId no existe en la colección Person.'
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

const UserModel = model('User', userSchema, 'User');

// -----------------------------------------------------------------------------
// Pet Schema
// -----------------------------------------------------------------------------
const petSchema = new Schema({
    photoPublicId: {
        type: String,
        default: null,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true
    },
    breed: {
        type: Number,
        required: true
    },
    birthDate: {
        type: Date,
        default: null
    },
    gender: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        default: null
    },
    favoriteFood: {
        type: String,
        default: null,
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

const PetModel = model('Pet', petSchema, 'Pet');

// -----------------------------------------------------------------------------
// Product Schema
// -----------------------------------------------------------------------------
const productSchema = new Schema({
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

const ProductModel = model('Product', productSchema, 'Product');

// -----------------------------------------------------------------------------
// Comment Schema
// -----------------------------------------------------------------------------
const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: buildExistsValidator(
            UserModel,
            'El userId no existe en la colección User.'
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
    },
    edited: {
        type: Boolean,
        required: true,
        default: false
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const CommentModel = model('Comment', commentSchema, 'Comment');

// -----------------------------------------------------------------------------
// Purchase Schema
// -----------------------------------------------------------------------------
const purchaseSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: buildExistsValidator(
            ProductModel,
            'El productId no existe en la colección Product.'
        )
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: buildExistsValidator(
            UserModel,
            'El userId no existe en la colección User.'
        )
    },
    petId: {
        type: Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
        validate: buildExistsValidator(
            PetModel,
            'El petId no existe en la colección Pet.'
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
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const PurchaseModel = model('Purchase', purchaseSchema, 'Purchase');

module.exports = {
    RoleModel,
    PersonModel,
    UserModel,
    PetModel,
    ProductModel,
    CommentModel,
    PurchaseModel
};
