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
    PRODUCTS: {
      GET_ALL: '/products',
      GET_BY_ID: (id: string) => `/products/${id}`,
    },
    CART: {
      GET: '/cart',
      ADD_ITEM: '/cart/items',
      UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
      REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
      CLEAR: '/cart',
      CHECKOUT: '/cart/checkout',
    },
    ORDERS: {
      GET_ALL: '/orders',
      GET_BY_ID: (id: string) => `/orders/${id}`,
    },
  },
};

