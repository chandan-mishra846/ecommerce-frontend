import axios from 'axios';

// Set base URL for all API calls
axios.defaults.baseURL = 'http://localhost:8000';

// Allow cookies to be sent with requests (for authentication)
axios.defaults.withCredentials = true;

// Set default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;

