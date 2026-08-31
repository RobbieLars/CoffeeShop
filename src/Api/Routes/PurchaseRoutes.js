// PurchaseRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (purchaseController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/purchase o con paginación GET /api/purchase?page=1&pageSize=5
    router.get('/', asyncHandler(purchaseController.GetPagedAsync));

    // GetByIdAsync: GET /api/purchase/:id
    router.get('/:id', asyncHandler(purchaseController.GetByIdAsync));

    // CreateAsync: POST /api/purchase
    router.post('/', asyncHandler(purchaseController.CreateAsync));

    // UpdateAsync: PUT /api/purchase/:id
    router.put('/:id', asyncHandler(purchaseController.UpdateAsync));

    // HardDeleteAsync: DELETE /api/purchase/:id
    router.delete('/:id', asyncHandler(purchaseController.HardDeleteAsync));

    return router;
};
