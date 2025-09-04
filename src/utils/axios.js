import axios from 'axios';

// Create axios instance with default config
const getBaseURL = () => {
    // Always prefer environment variable
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    
    // Fallback for production
    if (import.meta.env.PROD) {
        return 'https://ecommerce-backend-72js.onrender.com';
    }
    
    // Development mode - use proxy
    return '';
};

const instance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Log the configuration for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('[Axios Config] Environment:', import.meta.env.MODE);
  console.log('[Axios Config] VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('[Axios Config] Base URL set to:', getBaseURL());
}

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Log outgoing requests with full URL (only in development)
        if (import.meta.env.DEV) {
          const fullUrl = config.baseURL + config.url;
          console.log(`[API Request] ${config.method.toUpperCase()} ${fullUrl}`);
          console.log(`[API Request] Base URL: ${config.baseURL}`);
          console.log(`[API Request] Relative URL: ${config.url}`);
        }
        
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
        if (import.meta.env.DEV) {
          console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
        }
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

