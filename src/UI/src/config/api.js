const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const API_BASE_URL = configuredBaseUrl || '/api';

export {
    API_BASE_URL
};
