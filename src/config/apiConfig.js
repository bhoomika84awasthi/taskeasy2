// API Configuration
export const API_BASE_URL = process.env.VITE_API_BASE || 'https://backend-xfp1.vercel.app/api';
export const BACKEND_URL = API_BASE_URL.replace('/api', '');

console.log('🔧 API Configuration:',  {
  API_BASE_URL,
  BACKEND_URL,
  environment: import.meta.env.MODE
});
