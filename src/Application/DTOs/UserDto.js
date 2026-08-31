const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de un usuario
class CreateUserDto {
    constructor({
        photoProfilePublicId,
        username,
        password,
        personId
    } = {}) {
        this.photoProfilePublicId = photoProfilePublicId;
        this.username = username;
        this.password = password;
        this.personId = personId;
    }
}

// DTO para la actualización de un usuario
class UpdateUserDto {
    constructor({
        photoProfilePublicId,
        username,
        password,
        verified,
        lockedUntil,
        failedLoginAttempts,
        personId,
        enabled
    } = {}) {
        this.photoProfilePublicId = photoProfilePublicId;
        this.username = username;
        this.password = password;
        this.verified = verified;
        this.lockedUntil = lockedUntil;
        this.failedLoginAttempts = failedLoginAttempts;
        this.personId = personId;
        this.enabled = enabled;
    }
}

// DTO para los elementos de la lista de usuarios
class UserListItemDto {
    constructor({
        id,
        photoProfilePublicId,
        username,
        enabled
    } = {}) {
        this.id = id;
        this.photoProfilePublicId = photoProfilePublicId;
        this.username = username;
        this.enabled = enabled;
    }
}

// DTO para los detalles de un usuario
class UserDetailDto {
    constructor({
        id,
        photoProfilePublicId,
        username,
        verified,
        lockedUntil,
        failedLoginAttempts,
        personId,
        enabled,
        audit = null
    } = {}) {
        this.id = id;
        this.photoProfilePublicId = photoProfilePublicId;
        this.username = username;
        this.verified = verified;
        this.lockedUntil = lockedUntil;
        this.failedLoginAttempts = failedLoginAttempts;
        this.personId = personId;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreateUserDto,
    UpdateUserDto,
    UserListItemDto,
    UserDetailDto
};
