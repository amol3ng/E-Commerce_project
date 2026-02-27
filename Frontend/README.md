# Frontend

Vue 3 + Vite client for the e-commerce app.

## Install
```bash
npm install
```

## Environment
Create `Frontend/.env` from `Frontend/.env.example`.

Required:
- `VITE_API_BASE_URL` (example: `http://localhost:5000/api`)

## Run (Development)
```bash
npm run dev
```

Default local URL:
- `http://localhost:5173`

## Build
```bash
npm run build
```

## Preview Build
```bash
npm run preview
```

## Main Features
- Login/Register flow
- Protected pages (`/cart`, `/checkout`, `/orders`, `/track/:orderNumber`)
- Cart management
- Checkout and order placement
- Order history and tracking

## Notes
- Frontend sends Bearer token on protected cart/order requests.
- Keep API URL in env, not hardcoded per environment.
