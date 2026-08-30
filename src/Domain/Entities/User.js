// Entidad de dominio User.
class User {
    constructor({
        id,
        photoProfilePublicId = '',
        username,
        email = null,
        password = undefined,
        verified = false,
        lockedUntil = null,
        failedLoginAttempts = 0,
        personId,
        enabled = true,
        createdById = null,
        modifiedById = null
    } = {}) {
        this.id = id;
        this.photoProfilePublicId = photoProfilePublicId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.lockedUntil = lockedUntil;
        this.failedLoginAttempts = failedLoginAttempts;
        this.personId = personId;
        this.enabled = enabled;
        this.createdById = createdById;
        this.modifiedById = modifiedById;
    }
}

module.exports = User;
