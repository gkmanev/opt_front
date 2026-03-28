# Frontend app

A Vue 3 + Vite dashboard for the `gkmanev/investing` backend API.

## Getting started

```bash
npm install
npm run dev
```

### Preview the `front_dev` component

The new put-opportunities demo lives at `src/components/front_dev.vue`.
To preview it in the app, temporarily swap the root component:

1. Open `src/App.vue`.
2. Replace the current template with `<FrontDev />`.
3. Add the import at the top of the script:

```vue
<script setup>
import FrontDev from './components/front_dev.vue';
</script>
```

You can revert the change when you want the original dashboard back.

### API configuration

Create a `.env.local` file for machine-specific values. Client-visible variables must use the `VITE_` prefix.

Example:

```bash
VITE_API_BASE_URL=https://api.putpulse.com
VITE_LOCAL_API_BASE_URL=http://127.0.0.1:8000
VITE_USE_LOCAL_API=false
```

Notes:

- `VITE_API_BASE_URL` is the cloud/default API.
- `VITE_LOCAL_API_BASE_URL` is the optional local API base URL.
- `VITE_USE_LOCAL_API=true` makes the app start against the local API instead of cloud.
- `.env.example` documents the expected variables. Keep real values in `.env.local` or your deployment provider's env settings.

The UI expects these endpoints:

- `GET /api/summary`
- `GET /api/positions`
- `GET /api/market-movers`
