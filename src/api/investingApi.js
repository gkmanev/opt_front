const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://209.38.208.230:8080';
const weeklyInvestmentsBasePath = '/api/investments/';

const request = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, {
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
export const getPositions = () => request('/api/positions');
export const getMarketMovers = () => request('/api/market-movers');
const normalizeWeeklyInvestment = (idea) => ({
  ...idea,
  exp_date: idea.exp_date ?? idea.option_exp ?? idea.optionExp,
  expiration_date: idea.expiration_date ?? idea.exp_date ?? idea.option_exp ?? idea.optionExp,
});

const buildWeeklyInvestmentsPath = ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
  minDelta,
  maxDelta,
  screenerType,
} = {}) => {
  const resolvedScreenerType =
    screenerType === null || screenerType === undefined || screenerType === ''
      ? 'Custom screener filterV3'
      : screenerType;
  const params = new URLSearchParams({
    weekly_options: 'true',
    screener_type: resolvedScreenerType,
  });

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
  if (minDelta !== null && minDelta !== undefined && minDelta !== '') {
    params.set('min_delta', String(minDelta));
  }
  if (maxDelta !== null && maxDelta !== undefined && maxDelta !== '') {
    params.set('max_delta', String(maxDelta));
  }

  return `${weeklyInvestmentsBasePath}?${params.toString()}`;
};

export const getWeeklyInvestments = async ({
  minPrice,
  maxPrice,
  minRsi,
  maxRsi,
  minRoi,
  minDelta,
  maxDelta,
  screenerType,
} = {}) => {
  try {
    const data = await request(
      buildWeeklyInvestmentsPath({
        minPrice,
        maxPrice,
        minRsi,
        maxRsi,
        minRoi,
        minDelta,
        maxDelta,
        screenerType,
      }),
    );
    console.log('[getWeeklyInvestments] raw response', data);
    const list = Array.isArray(data) ? data : data.results ?? data.investments ?? [];
    return list.map((idea) => normalizeWeeklyInvestment(idea));
  } catch (error) {
    console.error('[getWeeklyInvestments] request failed', error);
    return [];
  }
};
export const apiBaseUrl = baseUrl;
