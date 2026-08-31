const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de un rol
class CreateRoleDto {
    constructor({ name, description } = {}) {
        this.name = name;
        this.description = description;
    }
}

// DTO para la actualización de un rol
class UpdateRoleDto {
    constructor({ name, description, enabled } = {}) {
        this.name = name;
        this.description = description;
        this.enabled = enabled;
    }
}

// DTO para los elementos de la lista de roles
class RoleListItemDto {
    constructor({ id, name } = {}) {
        this.id = id;
        this.name = name;
    }
}

// DTO para los detalles de un rol
class RoleDetailDto {
    constructor({
        id,
        name,
        description,
        enabled,
        audit = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreateRoleDto,
    UpdateRoleDto,
    RoleListItemDto,
    RoleDetailDto
};
