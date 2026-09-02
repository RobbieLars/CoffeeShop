const {
    CreateGiftDto,
    UpdateGiftDto,
    PatchGiftReceivedDto
} = require('../../Application/DTOs/GiftDto');

class GiftController {
    constructor(giftService) {
        this._giftService = giftService;

        this.GetPagedAsync = this.GetPagedAsync.bind(this);
        this.GetByIdAsync = this.GetByIdAsync.bind(this);
        this.CreateAsync = this.CreateAsync.bind(this);
        this.UpdateAsync = this.UpdateAsync.bind(this);
        this.PatchReceivedAsync = this.PatchReceivedAsync.bind(this);
        this.HardDeleteAsync = this.HardDeleteAsync.bind(this);
    }

    async GetPagedAsync(req, res) {
        const { page, pageSize, ...filters } = req.query;
        const result = await this._giftService.GetPagedAsync({
            page,
            pageSize,
            filters
        });

        return res.status(200).json(result);
    }

    async GetByIdAsync(req, res) {
        const result = await this._giftService.GetByIdAsync(req.params.id);
        return res.status(200).json(result);
    }

    async CreateAsync(req, res) {
        const dto = new CreateGiftDto(req.body);
        const result = await this._giftService.CreateAsync(dto);

        return res
            .status(201)
            .location(`/api/gift/${result.id}`)
            .json(result);
    }

    async UpdateAsync(req, res) {
        const dto = new UpdateGiftDto(req.body);
        const result = await this._giftService.UpdateAsync(req.params.id, dto);

        return res.status(200).json(result);
    }

    async PatchReceivedAsync(req, res) {
        const dto = new PatchGiftReceivedDto(req.body);
        const result = await this._giftService.PatchReceivedAsync(
            req.params.id,
            dto
        );

        return res.status(200).json(result);
    }

    async HardDeleteAsync(req, res) {
        await this._giftService.HardDeleteAsync(req.params.id);
        return res.status(204).send();
    }
}

module.exports = GiftController;
