// ProductRoutes.js
const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = (productController) => {
    const router = express.Router();

    // -----------------------------------------------------------------------------
    // Endpoints
    // -----------------------------------------------------------------------------

    // GetPagedAsync: GET /api/product o con paginación GET /api/product?page=1&pageSize=5
    router.get('/', asyncHandler(productController.GetPagedAsync));

    // GetByIdAsync: GET /api/product/:id
    router.get('/:id', asyncHandler(productController.GetByIdAsync));

    // CreateAsync: POST /api/product
    router.post('/', asyncHandler(productController.CreateAsync));

    // UpdateAsync: PUT /api/product/:id
    router.put('/:id', asyncHandler(productController.UpdateAsync));

    // SoftDeleteAsync: DELETE /api/product/:id
    router.delete('/:id', asyncHandler(productController.SoftDeleteAsync));

    // HardDeleteAsync: DELETE /api/product/hard/:id
    router.delete('/hard/:id', asyncHandler(productController.HardDeleteAsync));

    return router;
};