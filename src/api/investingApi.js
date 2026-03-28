import { getApiBaseUrl, requestJson, setApiBaseUrl } from './client';

export { getApiBaseUrl, setApiBaseUrl };

const API_ENDPOINT_PATHS = Object.freeze({
  investments: '/api/investments/',
  symbols: '/api/symbols/',
  'screener-types': '/api/screener-types/',
  'screener-filters': '/api/screener-filters/',
  'financial-statements': '/api/financial-statements/',
  'due-diligence-reports': '/api/due-diligence-reports/',
});

const resolveEndpointPath = (endpointKey) => {
  const endpointPath = API_ENDPOINT_PATHS[endpointKey];

  if (!endpointPath) {
    throw new Error(`Unknown API endpoint: ${endpointKey}`);
  }

  return endpointPath;
};

const request = async (endpointKey, options = {}) => {
  return requestJson(resolveEndpointPath(endpointKey), options);
};

const publicRequestOptions = (params = {}) => ({
  params,
  auth: false,
  skipRefresh: true,
});

export const getInvestments = (params = {}) => request('investments', publicRequestOptions(params));
export const getScreenerTypes = (params = {}) => request('screener-types', publicRequestOptions(params));
export const getScreenerFilters = (params = {}) => request('screener-filters', publicRequestOptions(params));
export const getFinancialStatements = (params = {}) => request('financial-statements', publicRequestOptions(params));
export const getDueDiligenceReports = (params = {}) => request('due-diligence-reports', publicRequestOptions(params));

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
    auth: false,
    skipRefresh: true,
  });

  return Array.isArray(data) ? data : data.results ?? [];
};
