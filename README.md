# E-Commerce Project

Full-stack e-commerce app with:
- `Backend`: Node.js + Express + MySQL API
- `Frontend`: Vue 3 + Vite client

## Project Structure
- `Backend/` API server, database scripts, authentication, orders, carts, products
- `Frontend/` web app UI and route-based pages

## Quick Start
1. Backend setup
   - `cd Backend`
   - `npm install`
   - Create `.env` from `Backend/.env.example`
   - Run DB schema/seed using `Backend/database/schema.sql` and `Backend/database/seed.sql`
   - `npm run dev`
2. Frontend setup
   - `cd Frontend`
   - `npm install`
   - Create `.env` from `Frontend/.env.example`
   - `npm run dev`

## Default Local URLs
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Notes
- Secrets must stay in local `.env` files only.
- See module-level docs:
  - `Backend/README.md`
  - `Frontend/README.md`
