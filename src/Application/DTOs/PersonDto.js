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

// DTO para los elementos de la lista de personas
class PersonListItemDto {
    constructor({
        id,
        name,
        lastName,
        email
    } = {}) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
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
        email,
        audit = null
    } = {}) {
        this.id = id;
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;

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
