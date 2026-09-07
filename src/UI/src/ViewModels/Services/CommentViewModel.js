import {
    COMMENT_INPUT_FIELDS,
    CREATE_COMMENT_INPUT_FIELDS
} from '../../Validator/Service/CommentViewModelValidator';

const COMMENT_FORM_LABELS = Object.freeze({
    userId: 'Usuario',
    subject: 'Asunto / Título',
    message: 'Mensaje de la reseña',
    photoPublicId: 'Fotografía adjunta'
});

// -----------------------------------------------------------------------------
// List item
// -----------------------------------------------------------------------------

class CommentListItemViewModel {
    static labels = Object.freeze({
        userUsername: 'Autor',
        subject: 'Asunto',
        message: 'Comentario',
        edited: 'Editado',
        actions: 'Acciones'
    });

    constructor({
        id,
        userId,
        userUsername = '',
        userPhotoProfilePublicId = '',
        subject,
        message,
        photoPublicId = null,
        edited = false,
        createdAt = null,
        actions = []
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername || 'Usuario anónimo';
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = Boolean(edited);
        this.editedLabel = this.edited ? 'Sí' : 'No';
        this.createdAt = createdAt;
        this.actions = Array.isArray(actions) ? actions : [];
    }
}

// -----------------------------------------------------------------------------
// Paged list
// -----------------------------------------------------------------------------

class CommentListViewModel {
    constructor({
        items = [],
        page = 1,
        pageSize = 5,
        totalItems = 0,
        totalPages = 0
    } = {}) {
        this.items = items.map(item =>
            item instanceof CommentListItemViewModel
                ? item
                : new CommentListItemViewModel(item)
        );

        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }
}

// -----------------------------------------------------------------------------
// Filters
// -----------------------------------------------------------------------------

class CommentFilterViewModel {
    static labels = Object.freeze({
        userUsername: 'Nombre de usuario',
        subject: 'Asunto',
        message: 'Contenido del mensaje'
    });

    static fields = Object.freeze({
        userUsername: Object.freeze({
            label: CommentFilterViewModel.labels.userUsername,
            type: 'string'
        }),
        subject: Object.freeze({
            label: CommentFilterViewModel.labels.subject,
            type: 'string'
        }),
        message: Object.freeze({
            label: CommentFilterViewModel.labels.message,
            type: 'string'
        })
    });

    constructor({
        userUsername = '',
        subject = '',
        message = ''
    } = {}) {
        this.userUsername = userUsername;
        this.subject = subject;
        this.message = message;
    }
}

// -----------------------------------------------------------------------------
// Detail
// -----------------------------------------------------------------------------

class CommentDetailViewModel {
    static labels = Object.freeze({
        userUsername: 'Autor',
        subject: 'Asunto',
        message: 'Mensaje',
        photoPublicId: 'Fotografía adjunta',
        edited: 'Editado',
        createdDateAt: 'Fecha de publicación',
        createdTimeAt: 'Hora de publicación',
        updatedDateAt: 'Fecha de última edición',
        updatedTimeAt: 'Hora de última edición'
    });

    constructor({
        id,
        userId,
        userUsername = '',
        userPhotoProfilePublicId = '',
        subject,
        message,
        photoPublicId = null,
        edited = false,
        audit = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.userUsername = userUsername || 'Usuario anónimo';
        this.userPhotoProfilePublicId = userPhotoProfilePublicId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
        this.edited = Boolean(edited);
        this.editedLabel = this.edited ? 'Sí' : 'No';

        this.createdDateAt = audit?.createdDateAt ?? null;
        this.createdTimeAt = audit?.createdTimeAt ?? null;
        this.createdTimePeriod = audit?.createdTimePeriod ?? null;
        this.updatedDateAt = audit?.updatedDateAt ?? null;
        this.updatedTimeAt = audit?.updatedTimeAt ?? null;
        this.updatedTimePeriod = audit?.updatedTimePeriod ?? null;
    }
}

// -----------------------------------------------------------------------------
// Create form
// -----------------------------------------------------------------------------

class CreateCommentViewModel {
    static fields = CREATE_COMMENT_INPUT_FIELDS;
    static labels = COMMENT_FORM_LABELS;

    constructor({
        userId = '',
        subject = '',
        message = '',
        photoPublicId = ''
    } = {}) {
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
    }
}

// -----------------------------------------------------------------------------
// Update form
// -----------------------------------------------------------------------------

class UpdateCommentViewModel {
    static fields = COMMENT_INPUT_FIELDS;
    static labels = COMMENT_FORM_LABELS;

    constructor({
        id,
        userId = '',
        subject = '',
        message = '',
        photoPublicId = ''
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.subject = subject;
        this.message = message;
        this.photoPublicId = photoPublicId;
    }
}

// -----------------------------------------------------------------------------
// Patch message form
// -----------------------------------------------------------------------------

class PatchCommentMessageViewModel {
    constructor({
        id,
        subject = '',
        message = ''
    } = {}) {
        this.id = id;
        this.subject = subject;
        this.message = message;
    }
}

export {
    COMMENT_FORM_LABELS,
    CommentListItemViewModel,
    CommentListViewModel,
    CommentFilterViewModel,
    CommentDetailViewModel,
    CreateCommentViewModel,
    UpdateCommentViewModel,
    PatchCommentMessageViewModel
};
