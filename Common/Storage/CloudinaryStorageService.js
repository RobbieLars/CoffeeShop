// CloudinaryStorageService.js

const fs = require('node:fs/promises');
const IPhotoStorageService = require('./IPhotoStorageService');
const { ValidationError } = require('../Errors/ApplicationErrors');

class CloudinaryStorageService extends IPhotoStorageService {
    constructor(cloudinaryClient, options = {}) {
        super();

        if (
            !cloudinaryClient ||
            !cloudinaryClient.uploader ||
            typeof cloudinaryClient.uploader.upload !== 'function' ||
            typeof cloudinaryClient.uploader.upload_stream !== 'function' ||
            typeof cloudinaryClient.uploader.destroy !== 'function'
        ) {
            throw new Error('CloudinaryStorageService requiere un cliente Cloudinary válido.');
        }

        this._cloudinary = cloudinaryClient;
        this._defaultFolder = this._normalizeDefaultFolder(options.defaultFolder);
    }

    // -----------------------------------------------------------------------------
    // uploadImageAsync:
    // Recibe un archivo y lo sube a Cloudinary.
    // Soporta archivos en memoria (file.buffer) o en disco (file.path).
    // Devuelve un objeto limpio con la URL y metadatos importantes.
    // -----------------------------------------------------------------------------
    async uploadImageAsync(file, options = {}) {
        if (!file) {
            throw new ValidationError('No se recibió ningún archivo para subir.');
        }

        const uploadOptions = this._buildUploadOptions(options);

        if (file.buffer) {
            return await this._uploadFromBufferAsync(file.buffer, uploadOptions);
        }

        if (file.path) {
            return await this._uploadFromPathAsync(file.path, uploadOptions);
        }

        throw new ValidationError(
            'El archivo recibido no es válido. Debe contener buffer o path.'
        );
    }

    // -----------------------------------------------------------------------------
    // deleteImageAsync:
    // Elimina una imagen de Cloudinary usando su publicId.
    // -----------------------------------------------------------------------------
    async deleteImageAsync(publicId) {
        if (!publicId) {
            throw new ValidationError(
                'El publicId es obligatorio para eliminar la imagen.'
            );
        }

        const result = await this._cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });

        return result;
    }

    // -----------------------------------------------------------------------------
    // replaceImageAsync:
    // Sobrescribe el contenido de una imagen conservando su publicId.
    // Si no existe un publicId anterior, realiza una subida normal.
    // -----------------------------------------------------------------------------
    async replaceImageAsync(file, publicId = null, options = {}) {
        if (!publicId) {
            return await this.uploadImageAsync(file, options);
        }

        return await this.uploadImageAsync(file, {
            ...options,
            folder: null,
            publicId,
            overwrite: true,
            uniqueFilename: false,
            invalidate: true,
        });
    }

    // -----------------------------------------------------------------------------
    // _uploadFromBufferAsync:
    // Sube un archivo desde memoria usando un buffer.
    // Ideal cuando se trabaja con multer.memoryStorage().
    // -----------------------------------------------------------------------------
    _uploadFromBufferAsync(buffer, uploadOptions) {
        return new Promise((resolve, reject) => {
            const stream = this._cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(this._mapUploadResponse(result));
                }
            );

            stream.end(buffer);
        });
    }

    // -----------------------------------------------------------------------------
    // _uploadFromPathAsync:
    // Sube un archivo desde una ruta temporal en disco.
    // Después de subirlo, intenta eliminar el archivo temporal local.
    // -----------------------------------------------------------------------------
    async _uploadFromPathAsync(filePath, uploadOptions) {
        try {
            const result = await this._cloudinary.uploader.upload(filePath, uploadOptions);
            return this._mapUploadResponse(result);
        } finally {
            await this._deleteLocalTempFileAsync(filePath);
        }
    }

    // -----------------------------------------------------------------------------
    // _deleteLocalTempFileAsync:
    // Elimina un archivo temporal local si existe.
    // Evita acumulación de archivos cuando multer guarda en disco.
    // -----------------------------------------------------------------------------
    async _deleteLocalTempFileAsync(filePath) {
        if (!filePath) {
            return;
        }

        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(
                    'Error al eliminar archivo temporal local:',
                    error.message
                );
            }
        }
    }

    // -----------------------------------------------------------------------------
    // _buildUploadOptions:
    // Construye las opciones de subida combinando valores por defecto
    // con opciones personalizadas enviadas por el consumidor.
    // -----------------------------------------------------------------------------
    _buildUploadOptions(options = {}) {
        return {
            folder: options.folder === null
                ? undefined
                : options.folder || this._defaultFolder,
            resource_type: 'image',
            use_filename: options.useFilename ?? true,
            unique_filename: options.uniqueFilename ?? true,
            overwrite: options.overwrite ?? false,
            invalidate: options.invalidate ?? false,
            public_id: options.publicId || undefined,
        };
    }

    // -----------------------------------------------------------------------------
    // MAX_FILE_SIZE:
    // Expone un límite sugerido de tamaño para archivos de imagen.
    // Puede reutilizarse desde middlewares o validaciones externas.
    // -----------------------------------------------------------------------------
    static get MAX_FILE_SIZE() {
        return 5 * 1024 * 1024;
    }

    // -----------------------------------------------------------------------------
    // _normalizeDefaultFolder:
    // Normaliza la carpeta predeterminada proporcionada por el sistema consumidor.
    // -----------------------------------------------------------------------------
    _normalizeDefaultFolder(defaultFolder) {
        if (defaultFolder === undefined || defaultFolder === null) {
            return undefined;
        }

        if (typeof defaultFolder !== 'string' || defaultFolder.trim() === '') {
            throw new Error('La carpeta predeterminada de Cloudinary debe ser un string válido.');
        }

        return defaultFolder.trim();
    }

    // -----------------------------------------------------------------------------
    // _mapUploadResponse:
    // Transforma la respuesta cruda de Cloudinary en un objeto más limpio
    // y útil para la aplicación.
    // -----------------------------------------------------------------------------
    _mapUploadResponse(result) {
        return {
            url: result.secure_url,
            publicId: result.public_id,
            originalFilename: result.original_filename,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            createdAt: result.created_at,
        };
    }
}

module.exports = CloudinaryStorageService;
