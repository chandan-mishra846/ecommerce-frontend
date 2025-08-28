import axios from 'axios';

const instance = axios.create({
    // We don't need baseURL because we're using Vite's proxy
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // For multipart/form-data, let the browser set the Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors
        const message = error.response?.data?.message || error.message;
        return Promise.reject({ message });
    }
);

export default instance;

