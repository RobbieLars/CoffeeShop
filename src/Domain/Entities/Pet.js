// Entidad de dominio Pet.
class Pet {
    constructor({
        id,
        photoPublicId = null,
        name,
        type,
        breed,
        birthDate = null,
        gender,
        weight = null,
        favoriteFood = null,
        enabled = true
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
    }
}

module.exports = Pet;
