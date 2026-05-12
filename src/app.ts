import Fastify from 'fastify';
import cors from '@fastify/cors';
import authRoutes from './routes/auth.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';
import config from './config/env.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true
});

fastify.get('/', async (request, reply) => {
  return {
    message: 'Mercado Libre API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'GET /auth/url': 'Get authorization URL',
        'GET /auth/callback': 'OAuth callback (automatic)',
        'POST /auth/refresh': 'Refresh access token'
      },
      orders: {
        'GET /orders?seller=ID': 'Search orders by seller',
        'GET /orders/count?seller=ID': 'Get order count by seller'
      },
      users: {
        'GET /users?user_id=ID&token=...': 'Get Mercado Libre user by id'
      }
    },
    status: config.clientId ? 'configured' : 'not configured'
  };
});

await fastify.register(authRoutes);
await fastify.register(ordersRoutes);
await fastify.register(usersRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();