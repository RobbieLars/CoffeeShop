const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de una mascota
class CreatePetDto {
    constructor({
        photoPublicId,
        name,
        type,
        breed,
        birthDate,
        gender,
        weight,
        favoriteFood
    } = {}) {
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
    }
}

// DTO para la actualización de una mascota
class UpdatePetDto {
    constructor({
        photoPublicId,
        name,
        type,
        breed,
        birthDate,
        gender,
        weight,
        favoriteFood,
        enabled
    } = {}) {
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
        this.enabled = enabled;
    }
}

// DTO para los elementos de la lista de mascotas
class PetListItemDto {
    constructor({
        id,
        photoPublicId,
        name,
        type,
        breed,
        enabled
    } = {}) {
        this.id = id;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.enabled = enabled;
    }
}

// DTO para el detalle de una mascota
class PetDetailDto {
    constructor({
        id,
        photoPublicId,
        name,
        type,
        breed,
        birthDate,
        gender,
        weight,
        favoriteFood,
        enabled,
        audit = null
    } = {}) {
        this.id = id;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
        this.enabled = enabled;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreatePetDto,
    UpdatePetDto,
    PetListItemDto,
    PetDetailDto
};
