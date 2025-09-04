import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
    // Use environment variable for production, fallback to proxy for development
    baseURL: import.meta.env.VITE_BACKEND_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Log outgoing requests with full URL
        const fullUrl = config.baseURL + config.url;
        console.log(`[API Request] ${config.method.toUpperCase()} ${fullUrl}`);
        console.log(`[API Request] Base URL: ${config.baseURL}`);
        console.log(`[API Request] Relative URL: ${config.url}`);
        
        // For multipart/form-data, let the browser set the Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        // Log detailed error information
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`[API Error] ${error.config?.url} - Status: ${error.response.status}`);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('[API Error] No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('[API Error] Request setup error:', error.message);
        }
        
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return Promise.reject({ message, originalError: error });
    }
);

// Set as default axios instance
axios.defaults.withCredentials = true;

export default instance;

