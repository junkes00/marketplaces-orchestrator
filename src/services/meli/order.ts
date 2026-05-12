import config from '../../config/env.js';
import type { OrderSearchResponse } from '../../types/index.js';

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
  searchOrders
};
