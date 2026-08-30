// Entidad de dominio Person.
class Person {
    constructor({
        id,
        name,
        secondName = '',
        lastName,
        secondLastName = ''
    } = {}) {
        this.id = id;
        this.name = name;
        this.secondName = secondName;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
    }
}

module.exports = Person;
