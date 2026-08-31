// Entidad de dominio Role.
class Role {
    constructor({
        id,
        name,
        description,
        enabled = true
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
    }
}

module.exports = Role;
