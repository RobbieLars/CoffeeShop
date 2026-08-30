// CompleteAuditMetadataDto.js
// DTO para exponer timestamps junto con los usuarios que realizaron los cambios.

const AuditMetadataFormatter = require('../Helpers/AuditMetadataFormatter');

class CompleteAuditMetadataDto {
    constructor(auditMetadata = {}, formatOptions = {}) {
        const formattedAudit = AuditMetadataFormatter.formatComplete(
            auditMetadata,
            formatOptions
        );

        this.createdByUserName = formattedAudit.createdByUserName;
        this.createdTimeAt = formattedAudit.createdTimeAt;
        this.createdTimePeriod = formattedAudit.createdTimePeriod;
        this.createdDateAt = formattedAudit.createdDateAt;
        this.updatedByUserName = formattedAudit.updatedByUserName;
        this.updatedTimeAt = formattedAudit.updatedTimeAt;
        this.updatedTimePeriod = formattedAudit.updatedTimePeriod;
        this.updatedDateAt = formattedAudit.updatedDateAt;
    }
}

module.exports = CompleteAuditMetadataDto;
