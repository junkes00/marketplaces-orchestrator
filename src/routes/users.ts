import type { FastifyInstance } from 'fastify';
import meliUser from '../services/meli/user.js';

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async (request, reply) => {
    const query = request.query as { token?: string; user_id?: string };
    const { token, user_id } = query;

    if (!user_id) {
      reply.code(400);
      return { error: 'user_id query parameter is required' };
    }

    if (!token) {
      reply.code(401);
      return { error: 'Not authenticated. Please sign in first.' };
    }

    try {
      return await meliUser.getUser(user_id, token);
    } catch (err: unknown) {
      const error = err as Error;
      reply.code(500);
      return { error: error.message };
    }
  });
}
