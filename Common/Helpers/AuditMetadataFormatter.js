// Formatea metadatos de auditoría para DTOs reutilizables.
class AuditMetadataFormatter {
    static DEFAULT_LOCALE = 'es-SV';
    static DEFAULT_TIME_ZONE = 'America/El_Salvador';
    static DEFAULT_HOUR_FORMAT = 12;

    static format(auditMetadata = {}, options = {}) {
        const formatOptions = this._normalizeOptions(options);
        const createdTime = this._formatTime(
            auditMetadata.createdAt,
            formatOptions
        );
        const updatedTime = this._formatTime(
            auditMetadata.updatedAt,
            formatOptions
        );

        return {
            createdTimeAt:
                createdTime.value ?? auditMetadata.createdTimeAt ?? null,
            createdTimePeriod:
                createdTime.period ?? auditMetadata.createdTimePeriod ?? null,
            createdDateAt:
                this._formatDate(auditMetadata.createdAt, formatOptions) ??
                auditMetadata.createdDateAt ??
                null,
            updatedTimeAt:
                updatedTime.value ?? auditMetadata.updatedTimeAt ?? null,
            updatedTimePeriod:
                updatedTime.period ?? auditMetadata.updatedTimePeriod ?? null,
            updatedDateAt:
                this._formatDate(auditMetadata.updatedAt, formatOptions) ??
                auditMetadata.updatedDateAt ??
                null
        };
    }

    static formatComplete(auditMetadata = {}, options = {}) {
        const formattedAudit = this.format(auditMetadata, options);

        return {
            createdByUserName: auditMetadata.createdByUserName ?? null,
            createdTimeAt: formattedAudit.createdTimeAt,
            createdTimePeriod: formattedAudit.createdTimePeriod,
            createdDateAt: formattedAudit.createdDateAt,
            updatedByUserName: auditMetadata.updatedByUserName ?? null,
            updatedTimeAt: formattedAudit.updatedTimeAt,
            updatedTimePeriod: formattedAudit.updatedTimePeriod,
            updatedDateAt: formattedAudit.updatedDateAt
        };
    }

    static _normalizeOptions(options) {
        return {
            locale: options.locale ?? this.DEFAULT_LOCALE,
            timeZone: options.timeZone ?? this.DEFAULT_TIME_ZONE,
            hourFormat: Number(options.hourFormat) === 24
                ? 24
                : this.DEFAULT_HOUR_FORMAT
        };
    }

    static _formatDate(value, options) {
        const date = this._toValidDate(value);

        if (!date) {
            return null;
        }

        return new Intl.DateTimeFormat(options.locale, {
            timeZone: options.timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }

    static _formatTime(value, options) {
        const date = this._toValidDate(value);

        if (!date) {
            return {
                value: null,
                period: null
            };
        }

        const timeParts = new Intl.DateTimeFormat('en-US', {
            timeZone: options.timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23'
        })
            .formatToParts(date)
            .reduce((parts, part) => {
                parts[part.type] = part.value;
                return parts;
            }, {});

        const hour = Number(timeParts.hour);
        const displayHour = options.hourFormat === 24
            ? hour
            : hour % 12 || 12;

        return {
            value: [
                String(displayHour).padStart(2, '0'),
                timeParts.minute,
                timeParts.second
            ].join(':'),
            period: hour >= 6 && hour < 18 ? 'day' : 'night'
        };
    }

    static _toValidDate(value) {
        if (!value) {
            return null;
        }

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
}

module.exports = AuditMetadataFormatter;
