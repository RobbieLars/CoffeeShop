const express = require('express');
const asyncHandler = require('@coffeeshop/common/Http/Express/asyncHandler');

module.exports = giftController => {
    const router = express.Router();

    router.get('/', asyncHandler(giftController.GetPagedAsync));
    router.get('/:id', asyncHandler(giftController.GetByIdAsync));
    router.post('/', asyncHandler(giftController.CreateAsync));
    router.put('/:id', asyncHandler(giftController.UpdateAsync));
    router.patch('/:id/received', asyncHandler(giftController.PatchReceivedAsync));
    router.delete('/:id', asyncHandler(giftController.HardDeleteAsync));

    return router;
};
