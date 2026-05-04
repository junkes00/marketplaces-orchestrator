import config from '../config/env.js';
import type { MeliTokens, OrderSearchResponse } from '../types/index.js';

const tokensStore = new Map<string, MeliTokens>();

export async function getAuthUrl(): Promise<string> {
  const { clientId, redirectUri, authBaseUrl } = config;
  if (!clientId || !redirectUri) {
    throw new Error('Missing clientId or redirectUri configuration');
  }
  const url = `${authBaseUrl}/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return url;
}

export async function exchangeCodeForToken(code: string, _userId?: string): Promise<MeliTokens> {
  const { clientId, clientSecret, redirectUri, apiBaseUrl } = config;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing clientId, clientSecret, or redirectUri configuration');
  }

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

  const tokens = await response.json() as MeliTokens;
  tokensStore.set(tokens.user_id, tokens);
  return tokens;
}

export async function refreshToken(userId: string): Promise<MeliTokens> {
  const tokens = tokensStore.get(userId);
  if (!tokens?.refresh_token) {
    throw new Error('No refresh token available');
  }

  const { clientId, clientSecret, apiBaseUrl } = config;
  if (!clientId || !clientSecret) {
    throw new Error('Missing clientId or clientSecret configuration');
  }

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

  const newTokens = await response.json() as MeliTokens;
  tokensStore.set(userId, newTokens);
  return newTokens;
}

export async function getAccessToken(userId: string): Promise<string> {
  const tokens = tokensStore.get(userId);
  if (!tokens) {
    throw new Error('No tokens available. Please authorize first.');
  }
  return tokens.access_token;
}

export async function searchOrders(sellerId: string, accessToken: string): Promise<OrderSearchResponse> {
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

  return response.json() as Promise<OrderSearchResponse>;
}

export default {
  getAuthUrl,
  exchangeCodeForToken,
  refreshToken,
  getAccessToken,
  searchOrders
};