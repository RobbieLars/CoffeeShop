const {
    UserListItemDto,
    UserDetailDto,
    CreateUserDto,
    UpdateUserDto
} = require('../DTOs/UserDto');
const CommonEnabledDto = require('@coffeeshop/common/DTOs/CommonEnabledDto');

const User = require('../../Domain/Entities/User');
const IPasswordHasher = require('../Interfaces/Common/Security/IPasswordHasher');
const ICommentCommands = require('../Interfaces/CQRS/Commands/ICommentCommands');

const {
    CreateUserDtoValidator,
    UpdateUserDtoValidator
} = require('../Validators/Service/UserDtoValidator');
const CommonEnabledDtoValidator =
    require('../Validators/Service/Common/CommonEnabledDtoValidator');

const validateRequiredObjectId = require('@coffeeshop/common/Helpers/validateRequiredObjectId');
const handleDuplicateKeyError = require('@coffeeshop/common/Helpers/handleDuplicateKeyError');
const {
    ValidationError,
    NotFoundError,
    ConflictError
} = require('@coffeeshop/common/Errors/ApplicationErrors');

class UserService {
    constructor(userRepository, paginationService, passwordHasher, commentCommands) {
        this._ensurePasswordHasher(passwordHasher);

        if (!(commentCommands instanceof ICommentCommands)) {
            throw new Error('commentCommands debe implementar ICommentCommands.');
        }

        this._userRepository = userRepository;
        this._paginationService = paginationService;
        this._passwordHasher = passwordHasher;
        this._commentCommands = commentCommands;
        this._createUserDtoValidator = new CreateUserDtoValidator();
        this._updateUserDtoValidator = new UpdateUserDtoValidator();
        this._commonEnabledDtoValidator = new CommonEnabledDtoValidator();
    }

    async GetPagedAsync(paginationData) {
        const searchCriteria = paginationData?.filters ?? {};

        return this._paginationService.paginate(
            this._userRepository,
            paginationData,
            userEntity => this._toUserListItemDto(userEntity),
            searchCriteria
        );
    }

    async GetByIdAsync(id) {
        const userId = validateRequiredObjectId(id, 'id');
        const result = await this._userRepository.getByIdWithAuditAsync(userId);

        if (!result) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        return this._toUserDetailDto(result.entity, result.audit);
    }

    async CreateAsync(createUserDto) {
        const dto = createUserDto instanceof CreateUserDto
            ? createUserDto
            : new CreateUserDto(createUserDto);

        const validationErrors = this._createUserDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const userEntity = new User({
            photoProfilePublicId: dto.photoProfilePublicId?.trim() ?? '',
            username: dto.username.trim().toLowerCase(),
            password: await this._passwordHasher.hash(dto.password),
            verified: false,
            lockedUntil: null,
            failedLoginAttempts: 0,
            personId: dto.personId,
            enabled: true
        });

        try {
            const createdUserEntity =
                await this._userRepository.createAsync(userEntity);

            return this._toUserDetailDto(createdUserEntity);
        } catch (error) {
            handleDuplicateKeyError(
                error,
                `Ya existe un Usuario con el username '${userEntity.username}'.`
            );
        }
    }

    async UpdateAsync(id, updateUserDto) {
        const userId = validateRequiredObjectId(id, 'id');
        const dto = updateUserDto instanceof UpdateUserDto
            ? updateUserDto
            : new UpdateUserDto(updateUserDto);

        const validationErrors = this._updateUserDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingUserEntity =
            await this._userRepository.getByIdAsync(userId);

        if (!existingUserEntity) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        const partialData = await this._buildUpdateData(dto);

        try {
            const updatedUserEntity =
                await this._userRepository.patchByIdAsync(userId, partialData);

            if (!updatedUserEntity) {
                throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
            }

            return this._toUserDetailDto(updatedUserEntity);
        } catch (error) {
            const username = partialData.username ?? existingUserEntity.username;
            handleDuplicateKeyError(
                error,
                `Ya existe un Usuario con el username '${username}'.`
            );
        }
    }

    async SoftDeleteAsync(id) {
        const userId = validateRequiredObjectId(id, 'id');
        const existingUserEntity =
            await this._userRepository.getByIdAsync(userId);

        if (!existingUserEntity) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        if (existingUserEntity.enabled === false) {
            throw new ConflictError('El Usuario ya está inhabilitado.');
        }

        const disabledUserEntity =
            await this._userRepository.patchByIdAsync(userId, { enabled: false });

        if (!disabledUserEntity) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        return this._toUserDetailDto(disabledUserEntity);
    }

    async PatchEnabledAsync(id, commonEnabledDto) {
        const userId = validateRequiredObjectId(id, 'id');
        const dto = commonEnabledDto instanceof CommonEnabledDto
            ? commonEnabledDto
            : new CommonEnabledDto(commonEnabledDto);
        const validationErrors = this._commonEnabledDtoValidator.validate(dto);

        if (validationErrors.length > 0) {
            throw new ValidationError('Error de validación.', validationErrors);
        }

        const existingUser = await this._userRepository.getByIdAsync(userId);

        if (!existingUser) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        const updatedUser = await this._userRepository.patchByIdAsync(
            userId,
            { enabled: dto.enabled }
        );

        if (!updatedUser) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        return this._toUserDetailDto(updatedUser);
    }

    async HardDeleteAsync(id) {
        const userId = validateRequiredObjectId(id, 'id');
        const deletedUserEntity =
            await this._userRepository.deleteByIdAsync(userId);

        if (!deletedUserEntity) {
            throw new NotFoundError(`Usuario (${userId}) no encontrado.`);
        }

        await this._commentCommands.deleteCommentsByUserIdCommandAsync(userId);

        return this._toUserDetailDto(deletedUserEntity);
    }

    async _buildUpdateData(dto) {
        const data = {};

        if (dto.photoProfilePublicId !== undefined) {
            data.photoProfilePublicId = dto.photoProfilePublicId.trim();
        }
        if (dto.username !== undefined) {
            data.username = dto.username.trim().toLowerCase();
        }
        if (dto.password !== undefined) {
            data.password = await this._passwordHasher.hash(dto.password);
        }
        if (dto.verified !== undefined) {
            data.verified = dto.verified;
        }
        if (dto.lockedUntil !== undefined) {
            data.lockedUntil = dto.lockedUntil;
        }
        if (dto.failedLoginAttempts !== undefined) {
            data.failedLoginAttempts = dto.failedLoginAttempts;
        }
        if (dto.personId !== undefined) {
            data.personId = dto.personId;
        }
        if (dto.enabled !== undefined) {
            data.enabled = dto.enabled;
        }

        return data;
    }

    _ensurePasswordHasher(passwordHasher) {
        const implementsContract =
            passwordHasher instanceof IPasswordHasher ||
            (
                passwordHasher &&
                typeof passwordHasher.hash === 'function' &&
                typeof passwordHasher.verify === 'function'
            );

        if (!implementsContract) {
            throw new Error('passwordHasher debe implementar IPasswordHasher.');
        }
    }

    _toUserDetailDto(userEntity, audit = null) {
        return new UserDetailDto({
            id: userEntity.id,
            photoProfilePublicId: userEntity.photoProfilePublicId,
            username: userEntity.username,
            verified: userEntity.verified,
            lockedUntil: userEntity.lockedUntil,
            failedLoginAttempts: userEntity.failedLoginAttempts,
            personId: userEntity.personId,
            enabled: userEntity.enabled,
            audit
        });
    }

    _toUserListItemDto(userEntity) {
        return new UserListItemDto({
            id: userEntity.id ?? userEntity._id,
            photoProfilePublicId: userEntity.photoProfilePublicId,
            username: userEntity.username,
            enabled: userEntity.enabled
        });
    }
}

module.exports = UserService;
