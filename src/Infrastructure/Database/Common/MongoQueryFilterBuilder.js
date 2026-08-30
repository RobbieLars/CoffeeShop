// Traduce criterios neutrales de búsqueda a filtros de MongoDB.
class MongoQueryFilterBuilder {
    static build(query = {}, config = {}) {
        const filters = [];

        for (const [paramName, options] of Object.entries(config)) {
            const rawValue = query?.[paramName];
            const filter = this._buildFilter(rawValue, options);

            if (filter) {
                filters.push(filter);
            }
        }

        return this._merge(filters);
    }

    static _buildFilter(value, options) {
        const normalizedValue = Array.isArray(value) ? value[0] : value;

        if (this._isEmpty(normalizedValue)) {
            return null;
        }

        switch (options.type) {
            case 'objectId':
                return this._objectIdEquals(options.field, normalizedValue);
            case 'string':
            case 'contains':
                return this._contains(options.field, normalizedValue);
            case 'date':
                return this._dateEquals(options.field, normalizedValue);
            case 'number':
                return this._numberEquals(options.field, normalizedValue);
            case 'boolean':
                return this._booleanEquals(options.field, normalizedValue);
            case 'equals':
                return { [options.field]: normalizedValue };
            case 'time':
                return this._timeEquals(options.field, normalizedValue);
            case 'search':
                return this._search(normalizedValue, options.fields);
            default:
                return null;
        }
    }

    static _isEmpty(value) {
        if (value === undefined || value === null) return true;
        if (typeof value !== 'string') return false;

        const normalized = value.trim().toLowerCase();
        return normalized === '' || normalized === 'null' || normalized === 'undefined';
    }

    static _noResults() {
        return { _id: null };
    }

    static _escapeRegex(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    static _merge(filters) {
        if (filters.length === 0) return {};
        if (filters.length === 1) return filters[0];
        return { $and: filters };
    }

    static _contains(field, value) {
        return {
            [field]: {
                $regex: this._escapeRegex(String(value).trim()),
                $options: 'i'
            }
        };
    }

    static _numberEquals(field, value) {
        const numberValue = Number(value);
        return Number.isInteger(numberValue)
            ? { [field]: numberValue }
            : this._noResults();
    }

    static _booleanEquals(field, value) {
        if (value === true || value === 'true') return { [field]: true };
        if (value === false || value === 'false') return { [field]: false };
        return this._noResults();
    }

    static _objectIdEquals(field, value) {
        const textValue = String(value).trim();
        return /^[0-9a-fA-F]{24}$/.test(textValue)
            ? { [field]: textValue }
            : this._noResults();
    }

    static _timeEquals(field, value) {
        const textValue = String(value).trim();
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(textValue)
            ? { [field]: textValue }
            : this._noResults();
    }

    static _dateEquals(field, value) {
        const normalizedValue = String(value ?? '').trim();

        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
            return this._noResults();
        }

        const startDate = new Date(`${normalizedValue}T00:00:00.000Z`);
        const endDate = new Date(`${normalizedValue}T23:59:59.999Z`);

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return this._noResults();
        }

        return {
            [field]: {
                $gte: startDate,
                $lte: endDate
            }
        };
    }

    static _search(value, fields = []) {
        const cleanFields = fields.filter(field => typeof field === 'string');

        if (cleanFields.length === 0) return null;

        return {
            $or: cleanFields.map(field => ({
                [field]: {
                    $regex: this._escapeRegex(String(value).trim()),
                    $options: 'i'
                }
            }))
        };
    }
}

module.exports = MongoQueryFilterBuilder;
