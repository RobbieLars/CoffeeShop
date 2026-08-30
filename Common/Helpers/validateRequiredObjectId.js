// validateRequiredObjectId.js

const { ValidationError } = require('../Errors/ApplicationErrors');

function validateRequiredObjectId(id, fieldName = 'id') {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new ValidationError(`El ${fieldName} es obligatorio.`, [
            `El ${fieldName} es obligatorio.`
        ]);
    }

    const trimmedId = id.trim();

    if (!/^[a-fA-F0-9]{24}$/.test(trimmedId)) {
        throw new ValidationError(`El ${fieldName} no es válido.`, [
            `El ${fieldName} debe tener un formato ObjectId válido.`
        ]);
    }

    return trimmedId;
}

module.exports = validateRequiredObjectId;
