# Mercado Libre API

Fastify REST API for Mercado Libre (Brazil) integration.

## Commands

- `pnpm run dev` - Run in development with tsx
- `pnpm run build` - Compile TypeScript to dist/
- `pnpm run start` - Run compiled production build

## Architecture

- Entry: `src/app.ts` (Fastify server on port 3000)
- Routes: `src/routes/auth.ts`, `src/routes/orders.ts`, `src/routes/users.ts`
- Services: `src/services/meli/auth.ts` (OAuth / tokens), `src/services/meli/user.ts` (ML user profile), `src/services/meli/order.ts` (order search against ML)
- Config: `src/config/env.ts` (reads .env)

## Notes

- ES modules - use `.js` extension in imports
- No test framework installed
- Type definitions in `src/types/index.ts`
- Build before deployment required
