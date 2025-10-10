export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL! || 'http://localhost:4000',
  ENDPOINTS: {
    AUTH: {
      SIGN_UP: '/auth/signup',
      SIGN_IN: '/auth/signin',
      SIGN_OUT: '/auth/signout',
      REFRESH: '/auth/refresh',
      ME: '/users/me',
    },
  },
};

console.log(API_CONFIG.BASE_URL)
