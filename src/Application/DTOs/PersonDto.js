const AuditMetadataDto = require('@coffeeshop/common/DTOs/AuditMetadataDto');

// DTO para la creación de una persona
class CreatePersonDto {
    constructor({
        name,
        secondName,
        lastName,
        secondLastName,
        birthDate,
        gender,
        email
    } = {}) {
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;
    }
}

// DTO para la actualización de una persona
class UpdatePersonDto {
    constructor({
        name,
        secondName,
        lastName,
        secondLastName,
        birthDate,
        gender,
        email,
        googleFolderPersonUrl
    } = {}) {
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;
        this.googleFolderPersonUrl = googleFolderPersonUrl;
    }
}

// DTO para los elementos de la lista de personas
class PersonListItemDto {
    constructor({
        id,
        name,
        lastName,
        userName = null,
        email
    } = {}) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
    }
}

// DTO para los detalles de una persona
class PersonDetailDto {
    constructor({
        id,
        name,
        secondName,
        lastName,
        secondLastName,
        birthDate,
        gender,
        userId = null,
        userName = null,
        email,
        googleFolderPersonUrl = null,
        audit = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.googleFolderPersonUrl = googleFolderPersonUrl;

        if (audit) {
            this.audit = audit instanceof AuditMetadataDto
                ? audit
                : new AuditMetadataDto(audit);
        }
    }
}

module.exports = {
    CreatePersonDto,
    UpdatePersonDto,
    PersonListItemDto,
    PersonDetailDto
};
