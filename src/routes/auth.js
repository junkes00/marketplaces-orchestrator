import meli from '../services/meli.js';
import config from '../config/env.js';

export default async function authRoutes(fastify) {
  fastify.get('/auth/url', async (request, reply) => {
    try {
      const url = await meli.getAuthUrl();
      return { authUrl: url };
    } catch (err) {
      reply.code(500);
      return { error: err.message };
    }
  });

  fastify.get('/auth/callback', async (request, reply) => {
    const { code, error: queryError } = request.query;

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
      frontendUrl.searchParams.set('user_id', tokens.user_id);

      return reply.redirect(frontendUrl.toString());
    } catch (err) {
      const frontendUrl = new URL(config.frontendUrl);
      frontendUrl.searchParams.set('auth', 'error');
      frontendUrl.searchParams.set('error', err.message);

      return reply.redirect(frontendUrl.toString());
    }
  });

  fastify.post('/auth/refresh', async (request, reply) => {
    try {
      const tokens = await meli.refreshToken();
      return {
        message: 'Token refreshed successfully',
        expiresIn: tokens.expires_in
      };
    } catch (err) {
      reply.code(500);
      return { error: err.message };
    }
  });
}