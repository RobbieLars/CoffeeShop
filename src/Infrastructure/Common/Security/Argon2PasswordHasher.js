const argon2 = require('argon2');
const IPasswordHasher = require('../../../Application/Interfaces/Common/Security/IPasswordHasher');
const { ValidationError } = require('@coffeeshop/common/Errors/ApplicationErrors');

class Argon2PasswordHasher extends IPasswordHasher {
    async hash(password) {
        this._validatePassword(password);

        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1
        });
    }

    async verify(password, hashedPassword) {
        this._validatePassword(password);

        if (typeof hashedPassword !== 'string' || hashedPassword.length === 0) {
            throw new ValidationError('El hash de la contraseña es obligatorio.');
        }

        try {
            return await argon2.verify(hashedPassword, password);
        } catch {
            return false;
        }
    }

    _validatePassword(password) {
        if (typeof password !== 'string' || password.trim().length === 0) {
            throw new ValidationError('La contraseña es obligatoria.');
        }
    }
}

module.exports = Argon2PasswordHasher;
