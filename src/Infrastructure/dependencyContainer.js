// dependencyContainer.js

// Persistence
const StoreDbContext = require('./Database/MernDb/dbContext');

// Shared services
const PaginationService = require('@coffeeshop/common/Services/PaginationService');

function buildDependencyContainer() {
    const storeDbContext = new StoreDbContext();
    const paginationService = new PaginationService();

    return {
        repositories: {
            roleRepository: storeDbContext.roles,
            personRepository: storeDbContext.people,
            userRepository: storeDbContext.users,
            productRepository: storeDbContext.products,
            commentRepository: storeDbContext.comments,
            purchaseRepository: storeDbContext.purchases
        },
        services: {
            paginationService
        },
        infrastructure: {
            storeDbContext
        }
    };
}

module.exports = buildDependencyContainer;
