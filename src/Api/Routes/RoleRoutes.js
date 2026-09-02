// RoleRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (roleController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/role o con paginación GET /api/role?page=1&pageSize=5
    router.get('/', asyncHandler(roleController.GetPagedAsync));

    // GetByIdAsync: GET /api/role/:id
    router.get('/:id', asyncHandler(roleController.GetByIdAsync));

    // CreateAsync: POST /api/role
    router.post('/', asyncHandler(roleController.CreateAsync));

    // UpdateAsync: PUT /api/role/:id
    router.put('/:id', asyncHandler(roleController.UpdateAsync));

    // PatchEnabledAsync: PATCH /api/role/:id/enabled
    router.patch('/:id/enabled', asyncHandler(roleController.PatchEnabledAsync));

    // SoftDeleteAsync: DELETE /api/role/:id
    router.delete('/:id', asyncHandler(roleController.SoftDeleteAsync));

    // HardDeleteAsync: DELETE /api/role/hard/:id
    router.delete('/hard/:id', asyncHandler(roleController.HardDeleteAsync));

    return router;
};
