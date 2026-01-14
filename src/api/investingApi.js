const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

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

export const apiBaseUrl = baseUrl;
