// PetRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (petController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/pet o con paginación GET /api/pet?page=1&pageSize=5
    router.get('/', asyncHandler(petController.GetPagedAsync));

    // GetByIdAsync: GET /api/pet/:id
    router.get('/:id', asyncHandler(petController.GetByIdAsync));

    // CreateAsync: POST /api/pet
    router.post('/', asyncHandler(petController.CreateAsync));

    // UpdateAsync: PUT /api/pet/:id
    router.put('/:id', asyncHandler(petController.UpdateAsync));

    // SoftDeleteAsync: DELETE /api/pet/:id
    router.delete('/:id', asyncHandler(petController.SoftDeleteAsync));

    // HardDeleteAsync: DELETE /api/pet/hard/:id
    router.delete('/hard/:id', asyncHandler(petController.HardDeleteAsync));

    return router;
};
