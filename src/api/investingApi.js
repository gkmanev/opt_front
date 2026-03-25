let apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://209.38.208.230:8080';
const optSymbolsBasePath = '/api/symbols/';

const normalizeBaseUrl = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const normalizePath = (path) => {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
};

const resolveUrl = (path) => {
  const base = normalizeBaseUrl(apiBaseUrl);
  const normalizedPath = normalizePath(path);
  if (base.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${base}${normalizedPath.slice(4)}`;
  }
  return `${base}${normalizedPath}`;
};

const request = async (path) => {
  const response = await fetch(resolveUrl(path), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export const getSummary = () => request('/api/summary');
export const getMarketMovers = () => request('/api/market-movers');

const buildSymbolsPath = ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
} = {}) => {
  const params = new URLSearchParams();

  if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
    params.set('min_price', String(minPrice));
  }
  if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
    params.set('max_price', String(maxPrice));
  }
  if (minRsi !== null && minRsi !== undefined && minRsi !== '') {
    params.set('min_rsi', String(minRsi));
  }
  if (maxRsi !== null && maxRsi !== undefined && maxRsi !== '') {
    params.set('max_rsi', String(maxRsi));
  }
  if (minRoi !== null && minRoi !== undefined && minRoi !== '') {
    params.set('min_roi', String(minRoi));
  }

  const query = params.toString();
  return query ? `${optSymbolsBasePath}?${query}` : optSymbolsBasePath;
};

export const getSymbols = async ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
} = {}) => {
  const data = await request(
    buildSymbolsPath({ minPrice, maxPrice, minRsi, maxRsi, minRoi }),
  );

  return Array.isArray(data) ? data : data.results ?? [];
};

export const setApiBaseUrl = (nextBaseUrl) => {
  if (!nextBaseUrl) return;
  apiBaseUrl = nextBaseUrl;
};

export const getApiBaseUrl = () => apiBaseUrl;

const TV_SCANNER_URL = 'https://scanner.tradingview.com/america/scan';

export const fetchTechnicalScores = async (tickers) => {
  if (!tickers?.length) return {};
  try {
    const response = await fetch(TV_SCANNER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        filter: [{ left: 'name', operation: 'in_range', right: tickers }],
        columns: ['name', 'Recommend.All|1M'],
        range: [0, tickers.length * 4],
      }),
    });
    if (!response.ok) return {};
    const json = await response.json();
    const map = {};
    for (const item of json.data ?? []) {
      const [name, score] = item.d;
      if (name && score != null && !(name in map)) {
        map[name] = score;
      }
    }
    return map;
  } catch {
    return {};
  }
};
