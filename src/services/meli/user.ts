import config from '../../config/env.js';

export async function getUser(userId: string, accessToken: string): Promise<Record<string, unknown>> {
  const { apiBaseUrl } = config;

  const response = await fetch(`${apiBaseUrl}/users/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get user');
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export default {
  getUser
};
