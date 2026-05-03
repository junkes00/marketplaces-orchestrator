import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../../.env');

const env = {};

try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (err) {
  console.warn('.env file not found. Using process.env instead.');
}

export const config = {
  clientId: process.env.MELI_CLIENT_ID || env.MELI_CLIENT_ID,
  clientSecret: process.env.MELI_CLIENT_SECRET || env.MELI_CLIENT_SECRET,
  redirectUri: process.env.MELI_REDIRECT_URI || env.MELI_REDIRECT_URI,
  sellerId: process.env.MELI_SELLER_ID || env.MELI_SELLER_ID,
  frontendUrl: process.env.MELI_FRONTEND_URL || env.MELI_FRONTEND_URL || 'http://localhost:5173/omni-mark',
  apiBaseUrl: 'https://api.mercadolibre.com',
  authBaseUrl: 'https://auth.mercadolivre.com.br'
};

export default config;