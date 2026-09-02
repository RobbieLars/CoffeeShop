// RoleService.js

// DTOs
const {
    RoleListItemDto,
    RoleDetailDto,
    CreateRoleDto,
    UpdateRoleDto
} = require('../DTOs/RoleDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

// Entities
const Role = require('../../Domain/Entities/Role');

// Validators
const {
    CreateRoleDtoValidator,
    UpdateRoleDtoValidator
} = require('../Validators/Service/RoleDtoValidator');
const CommonEnabledDtoValidator =
    require('../Validators/Service/Common/CommonEnabledDtoValidator');

// Helpers
const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const handleDuplicateKeyError = require('@coffeeshop/common/Helpers/handleDuplicateKeyError');
const {
    normalizeText,
    resolveUpdateValue
} = require('@coffeeshop/common/Helpers/valueHelpers');

// Errors
const {
    ValidationError,
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class RoleService {

    constructor(roleRepository, paginationService) {
        this._roleRepository = roleRepository;
        this._paginationService = paginationService;

        this._createRoleDtoValidator = new CreateRoleDtoValidator();
        this._updateRoleDtoValidator = new UpdateRoleDtoValidator();
        this._commonEnabledDtoValidator = new CommonEnabledDtoValidator();
    }

    // -----------------------------------------------------------------------------
    // GetPagedAsync
    // -----------------------------------------------------------------------------
    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return await this._paginationService.paginate(
            this._roleRepository,
            paginationData,
            roleEntity => this._toRoleListItemDto(roleEntity),
            searchCriteria
        );
    }

    // -----------------------------------------------------------------------------
    // GetByIdAsync
    // -----------------------------------------------------------------------------
    async GetByIdAsync(id) {
        const roleId = validateRequiredObjectId(id, 'id');

        const roleEntity = await this._roleRepository.getByIdWithAuditAsync(roleId);

        if (!roleEntity) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        return this._toRoleDetailDto(
            roleEntity.entity,
            roleEntity.audit
        );
    }

    // -----------------------------------------------------------------------------
    // CreateAsync
    // -----------------------------------------------------------------------------
    async CreateAsync(createRoleDto) {
        const dto = createRoleDto instanceof CreateRoleDto
            ? createRoleDto
            : new CreateRoleDto(createRoleDto);

        const validationErrors = this._createRoleDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const roleEntity = new Role({
            name: normalizeText(dto.name),
            description: normalizeText(dto.description),
            enabled: true
        });

        try {
            const createdRoleEntity =
                await this._roleRepository.createAsync(roleEntity);

            return this._toRoleDetailDto(createdRoleEntity);

        } catch (error) {
            handleDuplicateKeyError(
                error,
                'Ya existe un Rol con ese nombre.'
            );
        }
    }

    // -----------------------------------------------------------------------------
    // UpdateAsync
    // -----------------------------------------------------------------------------
    async UpdateAsync(id, updateRoleDto) {
        const roleId = validateRequiredObjectId(id, 'id');

        const dto = updateRoleDto instanceof UpdateRoleDto
            ? updateRoleDto
            : new UpdateRoleDto(updateRoleDto);

        const validationErrors =
            this._updateRoleDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Error de validación.',
                validationErrors
            );
        }

        const existingRoleEntity =
            await this._roleRepository.getByIdAsync(roleId);

        if (!existingRoleEntity) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        const roleEntity = new Role({
            id: roleId,

            name: resolveUpdateValue(
                dto.name,
                existingRoleEntity.name,
                normalizeText
            ),

            description: resolveUpdateValue(
                dto.description,
                existingRoleEntity.description,
                normalizeText
            ),

            enabled: resolveUpdateValue(
                dto.enabled,
                existingRoleEntity.enabled
            )
        });

        try {
            const updatedRoleEntity =
                await this._roleRepository.updateByIdAsync(
                    roleId,
                    roleEntity
                );

            if (!updatedRoleEntity) {
                throw new NotFoundError(
                    `Rol (${roleId}) no encontrado.`
                );
            }

            return this._toRoleDetailDto(updatedRoleEntity);

        } catch (error) {
            handleDuplicateKeyError(
                error,
                'Ya existe un Rol con ese nombre.'
            );
        }
    }

    // -----------------------------------------------------------------------------
    // SoftDeleteAsync
    // -----------------------------------------------------------------------------
    async SoftDeleteAsync(id) {
        const roleId = validateRequiredObjectId(id, 'id');

        const existingRoleEntity =
            await this._roleRepository.getByIdAsync(roleId);

        if (!existingRoleEntity) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        if (existingRoleEntity.enabled === false) {
            throw new ConflictError('El Rol ya está inhabilitado.');
        }

        const deletedRoleEntity =
            await this._roleRepository.patchByIdAsync(
                roleId,
                { enabled: false }
            );

        if (!deletedRoleEntity) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        return this._toRoleDetailDto(deletedRoleEntity);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const roleId = validateRequiredObjectId(id, 'id');
        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);
        const validationErrors = this._commonEnabledDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingRole = await this._roleRepository.getByIdAsync(roleId);

        if (!existingRole) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        const updatedRole = await this._roleRepository.patchByIdAsync(
            roleId,
            { enabled: dto.enabled }
        );

        if (!updatedRole) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        return this._toRoleDetailDto(updatedRole);
    }

    // -----------------------------------------------------------------------------
    // HardDeleteAsync
    // -----------------------------------------------------------------------------
    async HardDeleteAsync(id) {
        const roleId = validateRequiredObjectId(id, 'id');

        const deletedRoleEntity =
            await this._roleRepository.deleteByIdAsync(roleId);

        if (!deletedRoleEntity) {
            throw new NotFoundError(`Rol (${roleId}) no encontrado.`);
        }

        return this._toRoleDetailDto(deletedRoleEntity);
    }

    // -----------------------------------------------------------------------------
    // Mappers
    // -----------------------------------------------------------------------------

    _toRoleDetailDto(roleEntity, audit = null) {
        return new RoleDetailDto({
            id: roleEntity.id,
            name: roleEntity.name,
            description: roleEntity.description,
            enabled: roleEntity.enabled,
            audit
        });
    }

    _toRoleListItemDto(roleEntity) {
        return new RoleListItemDto({
            id: roleEntity.id ?? roleEntity._id,
            name: roleEntity.name
        });
    }
}

module.exports = RoleService;
