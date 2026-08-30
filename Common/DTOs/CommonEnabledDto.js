// DTO reutilizable para habilitar o deshabilitar un registro.
class CommonEnabledDto {
    constructor({ enabled } = {}) {
        this.enabled = enabled;
    }
}

module.exports = CommonEnabledDto;
