// PersonRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (personController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/person o con paginación GET /api/person?page=1&pageSize=5
    router.get('/', asyncHandler(personController.GetPagedAsync));

    // GetByIdAsync: GET /api/person/:id
    router.get('/:id', asyncHandler(personController.GetByIdAsync));

    // CreateAsync: POST /api/person
    router.post('/', asyncHandler(personController.CreateAsync));

    // UpdateAsync: PUT /api/person/:id
    router.put('/:id', asyncHandler(personController.UpdateAsync));

    // HardDeleteAsync: DELETE /api/person/:id
    router.delete('/:id', asyncHandler(personController.HardDeleteAsync));

    return router;
};
