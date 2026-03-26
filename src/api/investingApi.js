const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.putpulse.com';

const API_ENDPOINT_PATHS = Object.freeze({
  investments: '/api/investments/',
  symbols: '/api/symbols/',
  'screener-types': '/api/screener-types/',
  'screener-filters': '/api/screener-filters/',
  'financial-statements': '/api/financial-statements/',
  'due-diligence-reports': '/api/due-diligence-reports/',
});

let apiBaseUrl = DEFAULT_API_BASE_URL;

const normalizeBaseUrl = (value) => {
  const fallback = value || DEFAULT_API_BASE_URL;
  return fallback.endsWith('/') ? fallback : `${fallback}/`;
};

const appendSearchParams = (url, params = {}) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === null || item === undefined || item === '') return;
        url.searchParams.append(key, String(item));
      });
      return;
    }

    url.searchParams.set(key, String(value));
  });
};

const resolveEndpointUrl = (endpointKey, params) => {
  const endpointPath = API_ENDPOINT_PATHS[endpointKey];

  if (!endpointPath) {
    throw new Error(`Unknown API endpoint: ${endpointKey}`);
  }

  const url = new URL(endpointPath, normalizeBaseUrl(apiBaseUrl));
  appendSearchParams(url, params);
  return url.toString();
};

const request = async (endpointKey, { params } = {}) => {
  const response = await fetch(resolveEndpointUrl(endpointKey, params), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export const getInvestments = (params = {}) => request('investments', { params });
export const getScreenerTypes = (params = {}) => request('screener-types', { params });
export const getScreenerFilters = (params = {}) => request('screener-filters', { params });
export const getFinancialStatements = (params = {}) => request('financial-statements', { params });
export const getDueDiligenceReports = (params = {}) => request('due-diligence-reports', { params });

const buildSymbolsParams = ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
} = {}) => {
  const params = {};

  if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
    params.min_price = minPrice;
  }
  if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
    params.max_price = maxPrice;
  }
  if (minRsi !== null && minRsi !== undefined && minRsi !== '') {
    params.min_rsi = minRsi;
  }
  if (maxRsi !== null && maxRsi !== undefined && maxRsi !== '') {
    params.max_rsi = maxRsi;
  }
  if (minRoi !== null && minRoi !== undefined && minRoi !== '') {
    params.min_roi = minRoi;
  }

  return params;
};

export const getSymbols = async ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
} = {}) => {
  const data = await request('symbols', {
    params: buildSymbolsParams({ minPrice, maxPrice, minRsi, maxRsi, minRoi }),
  });

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
