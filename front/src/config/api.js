// Configuration centralisée des URLs - FORCE LOCAL
const BASE_URL = 'http://localhost:8081/api';

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: BASE_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  PROTOCOLS: {
    LIST: '/protocols',
    CREATE: '/protocols',
    GET: '/protocols/:id',
    UPDATE: '/protocols/:id',
    DELETE: '/protocols/:id',
    SUBMIT: '/protocols/:id/submit',
  },
  ADMIN: {
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
  },
};

export { BASE_URL };