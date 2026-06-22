import { getApiBaseUrl, requestJson, setApiBaseUrl } from './client';

export { getApiBaseUrl, setApiBaseUrl };

const API_ENDPOINT_PATHS = Object.freeze({
  'daily-briefs': '/api/daily-briefs/',
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
export const getDailyBriefs = async (params = {}) => {
  const data = await request('daily-briefs', publicRequestOptions(params));
  return Array.isArray(data) ? data : data.results ?? data.value ?? [];
};
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
  page,
  pageSize,
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
  if (page !== null && page !== undefined && page !== '') {
    params.page = page;
  }
  if (pageSize !== null && pageSize !== undefined && pageSize !== '') {
    params.page_size = pageSize;
  }

  return params;
};

export const getSymbols = async ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
  page,
  pageSize,
} = {}) => {
  const data = await request('symbols', {
    params: buildSymbolsParams({ minPrice, maxPrice, minRsi, maxRsi, minRoi, page, pageSize }),
    auth: true,
  });

  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      hasMore: false,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || data.length || 1,
      results: data,
    };
  }

  const results = Array.isArray(data.results) ? data.results : [];
  const resolvedPage = Number(data.page);
  const resolvedPageSize = Number(data.page_size);
  const resolvedCount = Number(data.count);

  return {
    count: Number.isNaN(resolvedCount) ? results.length : resolvedCount,
    next: data.next ?? null,
    previous: data.previous ?? null,
    hasMore: data.has_more === true,
    page: Number.isNaN(resolvedPage) ? (Number(page) || 1) : resolvedPage,
    pageSize: Number.isNaN(resolvedPageSize) || resolvedPageSize <= 0
      ? (Number(pageSize) || results.length || 1)
      : resolvedPageSize,
    results,
  };
};
