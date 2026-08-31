const ItemActions =
    require('@coffeeshop/common/Constants/ItemActions');

function isOwner(context) {
    const commentUserId = context?.comment?.userId;
    const currentUserId = context?.currentUserId;

    if (commentUserId == null || currentUserId == null) {
        return false;
    }

    return commentUserId.toString() === currentUserId.toString();
}

const CommentActionRules = Object.freeze({
    [ItemActions.EDIT]: isOwner,
    [ItemActions.DELETE]: isOwner

});

module.exports = CommentActionRules;
