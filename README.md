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

Set the API base URL with an environment variable:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

The UI expects these endpoints:

- `GET /api/summary`
- `GET /api/positions`
- `GET /api/market-movers`
