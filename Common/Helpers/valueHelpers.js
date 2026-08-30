// valueHelpers.js

function hasValue(value) {
    return value !== undefined && value !== null;
}

function normalizeText(value) {
    return value.trim();
}

function resolveUpdateValue(value, fallbackValue, normalizer = currentValue => currentValue) {
    return hasValue(value)
        ? normalizer(value)
        : fallbackValue;
}

module.exports = {
    hasValue,
    normalizeText,
    resolveUpdateValue
};
