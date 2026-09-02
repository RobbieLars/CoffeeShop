import {
    PET_INPUT_FIELDS,
    CREATE_PET_INPUT_FIELDS
} from '../Validator/Service/PetViewModelValidator';

// -----------------------------------------------------------------------------
// List item
// -----------------------------------------------------------------------------

class PetListItemViewModel {
    static labels = Object.freeze({
        name: 'Nombre',
        ownerName: 'Propietario',
        typeName: 'Tipo de mascota',
        photoPublicId: 'Fotografía',
        privacy: 'Privacidad'
    });

    constructor({
        id,
        ownerId,
        ownerName = null,
        photoPublicId = null,
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

        this.privacyName = privacy
            ? 'Privada'
            : 'Pública';
    }
}

// -----------------------------------------------------------------------------
// Paged list
// -----------------------------------------------------------------------------

class PetListViewModel {
    constructor({
        items = [],
        page = 1,
        pageSize = 5,
        totalItems = 0,
        totalPages = 0
    } = {}) {
        this.items = items.map(item =>
            item instanceof PetListItemViewModel
                ? item
                : new PetListItemViewModel(item)
        );

        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}

// -----------------------------------------------------------------------------
// Detail
// -----------------------------------------------------------------------------

class PetDetailViewModel {
    static labels = Object.freeze({
        name: 'Nombre',
        ownerName: 'Propietario',
        photoPublicId: 'Fotografía',
        typeName: 'Tipo de mascota',
        birthDate: 'Fecha de nacimiento',
        gender: 'Género',
        weight: 'Peso',
        favoriteFood: 'Comida favorita',
        privacy: 'Privacidad',
        createdDateAt: 'Fecha de creación',
        createdTimeAt: 'Hora de creación',
        updatedDateAt: 'Fecha de modificación',
        updatedTimeAt: 'Hora de modificación'
    });

    constructor({
        id,
        ownerId,
        ownerName = null,
        photoPublicId = null,
        name,
        type,
        typeName,
        birthDate = null,
        gender,
        weight = null,
        favoriteFood = null,
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

        this.privacyName = privacy
            ? 'Privada'
            : 'Pública';

        this.createdDateAt =
            audit?.createdDateAt ?? null;

        this.createdTimeAt =
            audit?.createdTimeAt ?? null;

        this.createdTimePeriod =
            audit?.createdTimePeriod ?? null;

        this.updatedDateAt =
            audit?.updatedDateAt ?? null;

        this.updatedTimeAt =
            audit?.updatedTimeAt ?? null;

        this.updatedTimePeriod =
            audit?.updatedTimePeriod ?? null;
    }
}

// -----------------------------------------------------------------------------
// Create form
// -----------------------------------------------------------------------------

class CreatePetViewModel {
    // La View utiliza estas reglas para configurar los inputs.
    static fields = CREATE_PET_INPUT_FIELDS;

    constructor({
        ownerId = '',
        photoPublicId = null,
        name = '',
        type = '',
        birthDate = '',
        gender = '',
        weight = '',
        favoriteFood = ''
    } = {}) {
        // Valores seleccionados por comboboxes o procesos internos.
        this.ownerId = ownerId;
        this.photoPublicId = photoPublicId;
        this.type = type;
        this.gender = gender;

        // Valores introducidos directamente por el usuario.
        this.name = name;
        this.birthDate = birthDate;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
    }
}

// -----------------------------------------------------------------------------
// Update form
// -----------------------------------------------------------------------------

class UpdatePetViewModel {
    static fields = PET_INPUT_FIELDS;

    constructor({
        id,
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
        this.id = id;

        // Datos controlados por listas, comboboxes o procesos internos.
        this.ownerId = ownerId;
        this.photoPublicId = photoPublicId;
        this.type = type;
        this.gender = gender;
        this.privacy = privacy;

        // Datos de escritura libre.
        this.name = name;
        this.birthDate = birthDate;
        this.weight = weight;
        this.favoriteFood = favoriteFood;
    }
}

// -----------------------------------------------------------------------------
// Patch owner form
// -----------------------------------------------------------------------------

class PatchPetOwnerViewModel {
    constructor({
        id,
        ownerId = ''
    } = {}) {
        this.id = id;
        this.ownerId = ownerId;
    }
}

export {
    PetListItemViewModel,
    PetListViewModel,
    PetDetailViewModel,
    CreatePetViewModel,
    UpdatePetViewModel,
    PatchPetOwnerViewModel
};