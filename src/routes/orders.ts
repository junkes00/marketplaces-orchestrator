import type { FastifyInstance } from 'fastify';
import meliOrder from '../services/meli/order.js';

export default async function ordersRoutes(fastify: FastifyInstance) {
  fastify.get('/orders', async (request, reply) => {
    const query = request.query as { token?: string; seller?: string };
    const { token, seller } = query;

    if (!seller) {
      reply.code(400);
      return { error: 'seller query parameter is required' };
    }

    if (!token) {
      reply.code(401);
      return { error: 'Not authenticated. Please sign in first.' };
    }

    try {
      const orders = await meliOrder.searchOrders(seller, token);

      return {
        paging: orders.paging,
        results: orders.results
      };
    } catch (err: unknown) {
      const error = err as Error;
      reply.code(500);
      return { error: error.message };
    }
  });

  fastify.get('/orders/count', async (request, reply) => {
    const query = request.query as { token?: string; seller?: string };
    const { token, seller } = query;

    if (!seller) {
      reply.code(400);
      return { error: 'seller query parameter is required' };
    }

    if (!token) {
      reply.code(401);
      return { error: 'Not authenticated. Please sign in first.' };
    }

    try {
      const orders = await meliOrder.searchOrders(seller, token);

      return {
        total: orders.paging.total,
        seller: seller
      };
    } catch (err: unknown) {
      const error = err as Error;
      reply.code(500);
      return { error: error.message };
    }
  });
}