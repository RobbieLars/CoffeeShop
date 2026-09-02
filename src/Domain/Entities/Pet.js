// Entidad de dominio Pet.
class Pet {
    constructor({
        id,
        ownerId,
        photoPublicId = null,
        name,
        type,
        birthDate = null,
        gender,
        weight = null,
        favoriteFood = null,
        privacy = true
    } = {}) {
        this.id = id;
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

module.exports = Pet;
