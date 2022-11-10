export const TrendingCoins = () =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

export const CoinList = () =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`;

export const SingleCoin = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;

const LIVE_API_URL = "https://jdoy-book-demo-api.netlify.app/.netlify/functions/api";
const DEV_API_URL = "http://localhost:9000/.netlify/functions/api";

export const API_URL = DEV_API_URL;
