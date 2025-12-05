import { EXCHANGE_RATES, HISTORICAL_RATES, CURRENCY_SYMBOLS } from '../constants';

/**
 * Obtient le taux de change historique pour une devise à une date donnée
 */
export const getHistoricalRate = (fromCurrency, toTimestamp, toCurrency = 'CAD') => {
  if (fromCurrency === toCurrency) return 1;
  
  const date = new Date(toTimestamp);
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  if (HISTORICAL_RATES[monthKey] && HISTORICAL_RATES[monthKey][fromCurrency]) {
    return HISTORICAL_RATES[monthKey][fromCurrency][toCurrency] || 1;
  }
  
  // Fallback sur les taux actuels
  if (EXCHANGE_RATES[fromCurrency] && EXCHANGE_RATES[fromCurrency][toCurrency]) {
    return EXCHANGE_RATES[fromCurrency][toCurrency];
  }
  
  return 1;
};

/**
 * Convertit un montant d'une devise à une autre
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, timestamp = Date.now()) => {
  if (fromCurrency === toCurrency) return amount;
  const rate = getHistoricalRate(fromCurrency, timestamp, toCurrency);
  return amount * rate;
};

/**
 * Obtient le symbole de la devise
 */
export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || '$';
};

/**
 * Formate un montant avec le symbole de devise
 */
export const formatCurrency = (amount, currency, options = {}) => {
  const { decimals = 0, showSymbol = true } = options;
  const symbol = showSymbol ? getCurrencySymbol(currency) : '';
  const formatted = Math.round(amount).toLocaleString();
  return `${symbol}${formatted}`;
};






