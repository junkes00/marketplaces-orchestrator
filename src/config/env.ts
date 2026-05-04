import type { MeliConfig } from '../types/index.js';

export const config: MeliConfig = {
  clientId: process.env.MELI_CLIENT_ID || '',
  clientSecret: process.env.MELI_CLIENT_SECRET || '',
  redirectUri: process.env.MELI_REDIRECT_URI || '',
  sellerId: process.env.MELI_SELLER_ID || '',
  frontendUrl: process.env.MELI_FRONTEND_URL || 'http://localhost:5173/omni-mark',
  apiBaseUrl: 'https://api.mercadolibre.com',
  authBaseUrl: 'https://auth.mercadolivre.com.br'
};

export default config;