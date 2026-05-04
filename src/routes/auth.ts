import type { FastifyInstance } from 'fastify';
import meli from '../services/meli.js';
import config from '../config/env.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/auth/url', async (request, reply) => {
    try {
      const url = await meli.getAuthUrl();
      return { authUrl: url };
    } catch (err: unknown) {
      const error = err as Error;
      reply.code(500);
      return { error: error.message };
    }
  });

  fastify.get('/auth/callback', async (request, reply) => {
    const query = request.query as { code?: string; error?: string };
    const { code, error: queryError } = query;

    if (queryError) {
      reply.code(400);
      return { error: queryError };
    }

    if (!code) {
      reply.code(400);
      return { error: 'Authorization code not provided' };
    }

    try {
      const tokens = await meli.exchangeCodeForToken(code);

      const frontendUrl = new URL(config.frontendUrl);
      frontendUrl.searchParams.set('auth', 'success');
      frontendUrl.searchParams.set('token', tokens.access_token);
      frontendUrl.searchParams.set('user_id', tokens.user_id);

      return reply.redirect(frontendUrl.toString());
    } catch (err: unknown) {
      const error = err as Error;
      const frontendUrl = new URL(config.frontendUrl);
      frontendUrl.searchParams.set('auth', 'error');
      frontendUrl.searchParams.set('error', error.message);

      return reply.redirect(frontendUrl.toString());
    }
  });

  fastify.post('/auth/refresh', async (request, reply) => {
    try {
      const body = request.body as { userId?: string };
      const { userId } = body;
      if (!userId) {
        reply.code(400);
        return { error: 'userId is required' };
      }
      const tokens = await meli.refreshToken(userId);
      return {
        message: 'Token refreshed successfully',
        expiresIn: tokens.expires_in
      };
    } catch (err: unknown) {
      const error = err as Error;
      reply.code(500);
      return { error: error.message };
    }
  });
}