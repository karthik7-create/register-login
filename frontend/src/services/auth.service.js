import axios from 'axios';

const API_BASE_URL = '/api/auth';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — inject JWT token for authenticated requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If user is logged in and gets 401, token has expired
            const token = localStorage.getItem('token');
            if (token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth service methods
const authService = {
    register: async (userData) => {
        const response = await api.post('/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
        });
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/login', {
            email: credentials.email,
            password: credentials.password,
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                })
            );
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
