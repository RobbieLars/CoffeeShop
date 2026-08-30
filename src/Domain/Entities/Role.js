// Entidad de dominio Role.
class Role {
    constructor({
        id,
        name,
        description,
        enabled = true,
        createdById = null,
        modifiedById = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
        this.createdById = createdById;
        this.modifiedById = modifiedById;
    }
}

module.exports = Role;
