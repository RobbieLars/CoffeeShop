// Entidad de dominio Person.
class Person {
    constructor({
        id,
        name,
        secondName = '',
        lastName,
        secondLastName = '',
        birthDate = null,
        gender = null,
        email = null,
    } = {}) {
        this.id = id;
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;
    }
}

module.exports = Person;
