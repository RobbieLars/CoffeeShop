// UserRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (userController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/user o con paginación GET /api/user?page=1&pageSize=5
    router.get('/', asyncHandler(userController.GetPagedAsync));

    // GetByIdAsync: GET /api/user/:id
    router.get('/:id', asyncHandler(userController.GetByIdAsync));

    // CreateAsync: POST /api/user
    router.post('/', asyncHandler(userController.CreateAsync));

    // UpdateAsync: PUT /api/user/:id
    router.put('/:id', asyncHandler(userController.UpdateAsync));

    // PatchEnabledAsync: PATCH /api/user/:id/enabled
    router.patch('/:id/enabled', asyncHandler(userController.PatchEnabledAsync));

    // SoftDeleteAsync: DELETE /api/user/:id
    router.delete('/:id', asyncHandler(userController.SoftDeleteAsync));

    // HardDeleteAsync: DELETE /api/user/hard/:id
    router.delete('/hard/:id', asyncHandler(userController.HardDeleteAsync));

    return router;
};
