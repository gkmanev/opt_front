# Frontend app

A Vue 3 + Vite dashboard for the `gkmanev/investing` backend API.

## Getting started

```bash
npm install
npm run dev
```

### API configuration

Set the API base URL with an environment variable:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

The UI expects these endpoints:

- `GET /api/summary`
- `GET /api/positions`
- `GET /api/market-movers`
