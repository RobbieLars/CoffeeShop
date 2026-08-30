// Helpers reutilizables para validaciones de existencia en Mongoose.
const mongoose = require('mongoose');

function buildExistsValidator(Model, notFoundMessage, options = {}) {
    const allowNull = options.allowNull ?? false;

    return {
        validator: async function (value) {
            if (value === undefined || value === null) {
                return allowNull;
            }

            if (!mongoose.isValidObjectId(value)) {
                return false;
            }

            const exists = await Model.exists({ _id: value });
            return Boolean(exists);
        },
        message: notFoundMessage
    };
}

module.exports = {
    buildExistsValidator
};
