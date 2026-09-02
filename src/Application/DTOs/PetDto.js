const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de una mascota
class CreatePetDto {
    constructor({
        ownerId,
        photoPublicId,
        name,
        type,
        birthDate,
        gender,
        weight,
        favoriteFood
    } = {}) {
        this.ownerId = ownerId;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
    }
}

// DTO para la actualización de una mascota
class UpdatePetDto {
    constructor({
        ownerId,
        photoPublicId,
        name,
        type,
        birthDate,
        gender,
        weight,
        favoriteFood,
        privacy
    } = {}) {
        this.ownerId = ownerId;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
        this.privacy = privacy;
    }
}

// DTO para cambiar únicamente el propietario de una mascota
class PatchPetOwnerDto {
    constructor({ ownerId } = {}) {
        this.ownerId = ownerId;
    }
}

// DTO para los elementos de la lista de mascotas
class PetListItemDto {
    constructor({
        id,
        ownerId,
        ownerName = null,
        photoPublicId,
        name,
        type,
        typeName,
        privacy
    } = {}) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.typeName = typeName;
        this.privacy = privacy;
    }
}

// DTO para el detalle de una mascota
class PetDetailDto {
    constructor({
        id,
        ownerId,
        ownerName,
        photoPublicId,
        name,
        type,
        typeName,
        birthDate,
        gender,
        weight,
        favoriteFood,
        privacy,
        audit = null
    } = {}) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.photoPublicId = photoPublicId;
        this.name = name;
        this.type = type;
        this.typeName = typeName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
        this.privacy = privacy;

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
    PatchPetOwnerDto,
    PetListItemDto,
    PetDetailDto
};
