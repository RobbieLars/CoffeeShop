class Gift {
    constructor({
        id,
        userId,
        productId,
        petId,
        date,
        giftReceived = false,
        googlePhotoPetUrl = null,
        googleFolderPetUrl = null
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.petId = petId;
        this.date = date;
        this.giftReceived = giftReceived;
        this.googlePhotoPetUrl = googlePhotoPetUrl;
        this.googleFolderPetUrl = googleFolderPetUrl;
    }
}

module.exports = Gift;
