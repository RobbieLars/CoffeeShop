// dependencyContainer.js

// Database
const StoreDbContext = require('./Database/MernDb/dbContext');

// CQRS Queries & Commands
const CommentQueries = require('./Database/CQRS/Queries/CommentQueries');
const PersonQueries = require('./Database/CQRS/Queries/PersonQueries');
const PetQueries = require('./Database/CQRS/Queries/PetQueries');
const PurchaseQueries = require('./Database/CQRS/Queries/PurchaseQueries');
const GiftQueries = require('./Database/CQRS/Queries/GiftQueries');
const CommentCommands = require('./Database/CQRS/Commands/CommentCommands');

// Shared services
const PaginationService = require('@coffeeshop/common/Services/PaginationService');
const Argon2PasswordHasher = require('./Common/Security/Argon2PasswordHasher');

// Application services
const RoleService = require('../Application/Services/RoleService');
const PersonService = require('../Application/Services/PersonService');
const UserService = require('../Application/Services/UserService');
const PetService = require('../Application/Services/PetService');
const ProductService = require('../Application/Services/ProductService');
const CommentService = require('../Application/Services/CommentService');
const PurchaseService = require('../Application/Services/PurchaseService');
const GiftService = require('../Application/Services/GiftService');

function buildDependencyContainer() {
    const storeDbContext = new StoreDbContext();
    const paginationService = new PaginationService();
    const passwordHasher = new Argon2PasswordHasher();

    // CQRS
    const commentQueries = new CommentQueries();
    const personQueries = new PersonQueries();
    const petQueries = new PetQueries();
    const purchaseQueries = new PurchaseQueries();
    const giftQueries = new GiftQueries();
    const commentCommands = new CommentCommands();

    const roleService = new RoleService(
        storeDbContext.roles,
        paginationService
    );
    const personService = new PersonService(
        storeDbContext.people,
        personQueries,
        paginationService
    );
    const userService = new UserService(
        storeDbContext.users,
        paginationService,
        passwordHasher,
        commentCommands
    );
    const petService = new PetService(
        storeDbContext.pets,
        petQueries,
        paginationService
    );
    const productService = new ProductService(
        storeDbContext.products,
        paginationService
    );
    const commentService = new CommentService(
        storeDbContext.comments,
        commentQueries,
        paginationService
    );
    const purchaseService = new PurchaseService(
        storeDbContext.purchases,
        purchaseQueries,
        paginationService
    );
    const giftService = new GiftService(
        storeDbContext.gifts,
        giftQueries,
        paginationService
    );

    return {
        repositories: {
            roleRepository: storeDbContext.roles,
            personRepository: storeDbContext.people,
            userRepository: storeDbContext.users,
            petRepository: storeDbContext.pets,
            productRepository: storeDbContext.products,
            commentRepository: storeDbContext.comments,
            purchaseRepository: storeDbContext.purchases,
            giftRepository: storeDbContext.gifts
        },
        queries: {
            commentQueries,
            personQueries,
            petQueries,
            purchaseQueries,
            giftQueries
        },
        commands: {
            commentCommands
        },
        services: {
            roleService,
            personService,
            userService,
            petService,
            productService,
            commentService,
            purchaseService,
            giftService
        },
        infrastructure: {
            storeDbContext,
            paginationService,
            passwordHasher
        }
    };
}

module.exports = buildDependencyContainer;
