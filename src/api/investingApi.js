const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://209.38.208.230:8080';
const weeklyInvestmentsPath =
  '/api/investments/?weekly_options=true&screener_type=Custom%20screener%20filterV3';

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

export const getWeeklyInvestments = async () => {
  try {
    const data = await request(weeklyInvestmentsPath);
    console.log('[getWeeklyInvestments] raw response', data);
    const list = Array.isArray(data) ? data : data.results ?? data.investments ?? [];
    return list.map((idea) => normalizeWeeklyInvestment(idea));
  } catch (error) {
    console.error('[getWeeklyInvestments] request failed', error);
    return [];
  }
};
export const apiBaseUrl = baseUrl;
