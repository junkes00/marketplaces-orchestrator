import meli from '../services/meli.js';

export default async function ordersRoutes(fastify) {
  fastify.get('/orders', async (request, reply) => {
    const { seller } = request.query;

    if (!seller) {
      reply.code(400);
      return { error: 'seller query parameter is required' };
    }

    try {
      const accessToken = await meli.getAccessToken();
      const orders = await meli.searchOrders(seller, accessToken);

      return {
        paging: orders.paging,
        results: orders.results
      };
    } catch (err) {
      if (err.message.includes('No tokens available')) {
        reply.code(401);
        return { error: 'Not authenticated. Please call /auth/url first.' };
      }
      reply.code(500);
      return { error: err.message };
    }
  });

  fastify.get('/orders/count', async (request, reply) => {
    const { seller } = request.query;

    if (!seller) {
      reply.code(400);
      return { error: 'seller query parameter is required' };
    }

    try {
      const accessToken = await meli.getAccessToken();
      const orders = await meli.searchOrders(seller, accessToken);

      return {
        total: orders.paging.total,
        seller: seller
      };
    } catch (err) {
      if (err.message.includes('No tokens available')) {
        reply.code(401);
        return { error: 'Not authenticated. Please call /auth/url first.' };
      }
      reply.code(500);
      return { error: err.message };
    }
  });
}