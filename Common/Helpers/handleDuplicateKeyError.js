// handleDuplicateKeyError.js

const { ConflictError } = require('../Errors/ApplicationErrors');

function handleDuplicateKeyError(error, message) {
    if (error?.code === 11000) {
        throw new ConflictError(message);
    }

    throw error;
}

module.exports = handleDuplicateKeyError;
