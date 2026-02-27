# Backend API

Express + MySQL backend for authentication, products, carts, and orders.

## Tech Stack
- Node.js (ES modules)
- Express
- MySQL (`mysql2`)
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Email (`nodemailer`)

## Install
```bash
npm install
```

## Environment
Create `Backend/.env` from `Backend/.env.example`.

Required variables:
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `MAIL_USER`
- `MAIL_PASS`
- `FRONTEND_URL`

## Database
1. Create schema:
   - Run `database/schema.sql`
2. Seed data:
   - Run `database/seed.sql`

## Run
```bash
npm run dev
```
or
```bash
npm start
```

## Base URL
- `http://localhost:5000`

## Auth
- Register: `POST /api/users`
- Login: `POST /api/users/login`
- Current user: `GET /api/users/me` (Bearer token)
- Profile routes are protected and ownership-checked:
  - `GET /api/users/:id`
  - `PATCH /api/users/:id`
  - `DELETE /api/users/:id`

## Other API Groups
- Products: `/api/products`
- Carts (protected): `/api/carts`
- Orders (protected): `/api/orders`

## Troubleshooting
- `Access denied for user 'root'@'localhost'`:
  - Check `DB_USER`/`DB_PASSWORD` in `.env`
  - If password starts with `#`, wrap it in quotes.
