import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from '../config/env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = join(__dirname, '../../tokens.json');

function loadTokens() {
  if (!existsSync(tokensPath)) {
    return null;
  }
  try {
    const data = readFileSync(tokensPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

function saveTokens(tokens) {
  writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
}

export async function getAuthUrl() {
  const { clientId, redirectUri, authBaseUrl } = config;
  const url = `${authBaseUrl}/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return url;
}

export async function exchangeCodeForToken(code) {
  const { clientId, clientSecret, redirectUri, apiBaseUrl } = config;

  const response = await fetch(`${apiBaseUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to exchange code for token');
  }

  const tokens = await response.json();
  saveTokens(tokens);
  return tokens;
}

export async function refreshToken() {
  const tokens = loadTokens();
  if (!tokens || !tokens.refresh_token) {
    throw new Error('No refresh token available');
  }

  const { clientId, clientSecret, apiBaseUrl } = config;

  const response = await fetch(`${apiBaseUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to refresh token');
  }

  const newTokens = await response.json();
  saveTokens(newTokens);
  return newTokens;
}

export async function getAccessToken() {
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error('No tokens available. Please authorize first.');
  }
  return tokens.access_token;
}

export async function searchOrders(sellerId, accessToken) {
  const { apiBaseUrl } = config;

  const response = await fetch(`${apiBaseUrl}/orders/search?seller=${sellerId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search orders');
  }

  return response.json();
}

export default {
  getAuthUrl,
  exchangeCodeForToken,
  refreshToken,
  getAccessToken,
  searchOrders
};