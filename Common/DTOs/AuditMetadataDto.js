// AuditMetadataDto.js
// DTO reutilizable para exponer timestamps en un formato amigable para la vista.

const AuditMetadataFormatter = require('../Helpers/AuditMetadataFormatter');

class AuditMetadataDto {
    constructor(auditMetadata = {}, formatOptions = {}) {
        const formattedAudit = AuditMetadataFormatter.format(
            auditMetadata,
            formatOptions
        );

        this.createdTimeAt = formattedAudit.createdTimeAt;
        this.createdTimePeriod = formattedAudit.createdTimePeriod;
        this.createdDateAt = formattedAudit.createdDateAt;
        this.updatedTimeAt = formattedAudit.updatedTimeAt;
        this.updatedTimePeriod = formattedAudit.updatedTimePeriod;
        this.updatedDateAt = formattedAudit.updatedDateAt;
    }
}

module.exports = AuditMetadataDto;
