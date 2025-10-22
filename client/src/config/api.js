// API Configuration using environment variables
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment
  ? (import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:4000')
  : (import.meta.env.VITE_API_BASE_URL_PROD || 'https://holy-family-church-r5cj.vercel.app');

// API endpoints
export const AUTH_API = `${API_BASE_URL}/church/auth`;
export const CALENDAR_API = `${API_BASE_URL}/church/calendar`;
export const MEMBERS_API = `${API_BASE_URL}/church/members`;
export const FAMILIES_API = `${API_BASE_URL}/church/families`;
export const GROUPS_API = `${API_BASE_URL}/church/groups`;