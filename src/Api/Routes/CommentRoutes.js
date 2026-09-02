// CommentRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (commentController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/comment o con paginación GET /api/comment?page=1&pageSize=5
    router.get('/', asyncHandler(commentController.GetPagedAsync));

    // GetByIdAsync: GET /api/comment/:id
    router.get('/:id', asyncHandler(commentController.GetByIdAsync));

    // CreateAsync: POST /api/comment
    router.post('/', asyncHandler(commentController.CreateAsync));

    // UpdateAsync: PUT /api/comment/:id
    router.put('/:id', asyncHandler(commentController.UpdateAsync));

    // PatchMessageAsync: PATCH /api/comment/:id/message
    router.patch('/:id/message', asyncHandler(commentController.PatchMessageAsync));

    // HardDeleteAsync: DELETE /api/comment/hard/:id
    router.delete('/hard/:id', asyncHandler(commentController.HardDeleteAsync));

    return router;
};
