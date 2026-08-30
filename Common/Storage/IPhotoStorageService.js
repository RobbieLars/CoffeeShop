// IPhotoStorageService.js

// Interfaz para servicios de almacenamiento de fotos.
// Define métodos para subir, eliminar y reemplazar imágenes.
class IPhotoStorageService {
    constructor() {
        if (new.target === IPhotoStorageService) {
            throw new Error('IPhotoStorageService no puede ser instanciada directamente.');
        }
    }

    // -----------------------------------------------------------------------------
    // uploadImageAsync:
    // Sube una imagen y devuelve sus datos principales.
    // -----------------------------------------------------------------------------
    async uploadImageAsync(file, options = {}) {
        throw new Error('Método uploadImageAsync no implementado.');
    }

    // -----------------------------------------------------------------------------
    // deleteImageAsync:
    // Elimina una imagen usando su publicId.
    // -----------------------------------------------------------------------------
    async deleteImageAsync(publicId) {
        throw new Error('Método deleteImageAsync no implementado.');
    }

    // -----------------------------------------------------------------------------
    // replaceImageAsync:
    // Reemplaza el contenido de una imagen conservando su publicId.
    // -----------------------------------------------------------------------------
    async replaceImageAsync(file, publicId = null, options = {}) {
        throw new Error('Método replaceImageAsync no implementado.');
    }
}

module.exports = IPhotoStorageService;
