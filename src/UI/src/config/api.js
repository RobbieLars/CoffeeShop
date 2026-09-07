const configuredBaseUrl = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    ''
).trim();

// Normalize base URL: strip trailing slash and trailing '/api' if endpoints prepend '/api'
const normalizedBaseUrl = configuredBaseUrl
    ? configuredBaseUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '')
    : '';

const API_BASE_URL = normalizedBaseUrl || '/api';

export {
    API_BASE_URL
};
