// Repositorio genérico para operaciones CRUD.
// Recibe un Model de Mongoose y un Mapper para convertir
// entre documentos de MongoDB y entidades de dominio.

// Incluimos la interfaz que define el contrato del repositorio genérico.
const IMainRepository = require('../../Application/Interfaces/Common/Persistence/IMainRepository');
const MongoAuditMetadata = require('../Database/Common/MongoAuditMetadata');
const MongoQueryFilterBuilder = require('../Database/Common/MongoQueryFilterBuilder');

// Repositorio genérico para operaciones CRUD.
// Recibe un Model de Mongoose y un Mapper para convertir
// entre documentos de MongoDB y entidades de dominio.
class MainRepository extends IMainRepository {
    constructor(Model, mapper, searchFilterConfig = {}) {
        super();
        this._model = Model;
        this._mapper = mapper;
        this._searchFilterConfig = searchFilterConfig;
    }

    // Valida que el filtro sea un objeto no nulo y no un array.
    _isValidFilter(filter) {
        return (
            filter !== null &&
            typeof filter === 'object' &&
            !Array.isArray(filter)
        );
    }

    // Devuelve un filtro seguro: si el filtro recibido es válido, lo devuelve;
    // de lo contrario, devuelve un objeto vacío para evitar errores en las consultas.
    _getSafeFilter(filter) {
        return this._isValidFilter(filter)
            ? filter
            : {};
    }

    // Obtiene una página y traduce los criterios recibidos a un filtro MongoDB.
    async getPagedAsync(page, pageSize, searchCriteria = {}) {
        const currentPage = Number(page) || 1;
        const currentPageSize = Number(pageSize) || 5;
        const skip = (currentPage - 1) * currentPageSize;

        const safeSearchCriteria = this._getSafeFilter(searchCriteria);
        const mongoFilter = MongoQueryFilterBuilder.build(
            safeSearchCriteria,
            this._searchFilterConfig
        );

        const [docs, totalItems] = await Promise.all([
            this._model
                .find(mongoFilter)
                .sort({ _id: 1 })
                .skip(skip)
                .limit(currentPageSize)
                .lean(),

            this._model.countDocuments(mongoFilter)
        ]);

        return {
            items: docs.map(doc => this._mapper.toDomain(doc)),
            totalItems
        };
    }

    // Obtiene todos los documentos de la colección
    // y los transforma a entidades de dominio.
    // Puede recibir filtros opcionales.
    async getAllAsync(filter = {}) {
        const safeFilter = this._getSafeFilter(filter);

        const docs = await this._model
            .find(safeFilter)
            .lean();

        return docs.map(doc => this._mapper.toDomain(doc));
    }

    // Busca un documento por su ID.
    // Si existe, lo transforma a entidad de dominio;
    // si no existe, devuelve null.
    async getByIdAsync(id) {
        const doc = await this._model.findById(id).lean();
        return this._mapper.toDomain(doc);
    }

    // Busca un documento por su ID y devuelve un objeto que incluye
    // la entidad de dominio y los metadatos de auditoría.
    async getByIdWithAuditAsync(id) {
        const mongoDoc = await this._model.findById(id).lean();

        if (!mongoDoc) {
            return null;
        }

        return {
            entity: this._mapper.toDomain(mongoDoc),
            audit: MongoAuditMetadata.fromDocument(mongoDoc)
        };
    }

    // Busca un documento por su ID y devuelve timestamps junto con
    // los usuarios que crearon o actualizaron el documento.
    async getByIdWithCompleteAuditAsync(id) {
        const mongoDoc = await this._model.findById(id).lean();

        if (!mongoDoc) {
            return null;
        }

        return {
            entity: this._mapper.toDomain(mongoDoc),
            audit: await MongoAuditMetadata.fromDocumentWithUserAsync(mongoDoc)
        };
    }

    // Crea un nuevo documento a partir de una entidad de dominio
    // y devuelve la entidad creada con su ID generado.
    async createAsync(entity) {
        const data = this._mapper.toPersistence(entity);
        const createdDoc = await this._model.create(data);
        return this._mapper.toDomain(createdDoc);
    }

    // Actualiza completamente un documento por su ID
    // usando los datos de la entidad recibida.
    // Devuelve la entidad actualizada o null si no existe.
    async updateByIdAsync(id, entity) {
        const data = this._mapper.toPersistence(entity);

        const updatedDoc = await this._model.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).lean();

        return this._mapper.toDomain(updatedDoc);
    }

    // Actualiza parcialmente un documento por su ID
    // usando solo los campos enviados en partialData.
    // Devuelve la entidad actualizada o null si no existe.
    async patchByIdAsync(id, partialData) {
        const persistenceData = this._mapper.toPartialPersistence
            ? this._mapper.toPartialPersistence(partialData)
            : partialData;

        const updatedDoc = await this._model.findByIdAndUpdate(
            id,
            persistenceData,
            { new: true, runValidators: true }
        ).lean();

        return this._mapper.toDomain(updatedDoc);
    }

    // Actualiza parcialmente varios documentos según un filtro.
    // Devuelve el conteo de documentos encontrados y modificados.
    async patchManyAsync(filter = {}, partialData = {}) {
        if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
            throw new Error('El filtro para patchManyAsync debe ser un objeto válido.');
        }

        if (Object.keys(filter).length === 0) {
            throw new Error('patchManyAsync requiere un filtro no vacío.');
        }

        if (!partialData || typeof partialData !== 'object' || Array.isArray(partialData)) {
            throw new Error('Los datos parciales para patchManyAsync deben ser un objeto válido.');
        }

        if (Object.keys(partialData).length === 0) {
            throw new Error('patchManyAsync requiere datos para actualizar.');
        }

        const persistenceData = this._mapper.toPartialPersistence
            ? this._mapper.toPartialPersistence(partialData)
            : partialData;

        const result = await this._model.updateMany(
            filter,
            { $set: persistenceData },
            { runValidators: true }
        );

        return {
            matchedCount: result.matchedCount ?? result.n ?? 0,
            modifiedCount: result.modifiedCount ?? result.nModified ?? 0
        };
    }

    // Elimina un documento por su ID
    // y devuelve la entidad eliminada.
    // Si no existe, devuelve null.
    async deleteByIdAsync(id) {
        const deletedDoc = await this._model.findByIdAndDelete(id).lean();
        return this._mapper.toDomain(deletedDoc);
    }
}

module.exports = MainRepository;
