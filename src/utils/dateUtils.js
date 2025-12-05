/**
 * Formate une date au format court (ex: "jan. 24")
 */
export const formatDateShort = (timestamp) => {
  const date = new Date(timestamp);
  const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return `${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
};

/**
 * Formate une date au format long (ex: "Janvier 2024")
 */
export const formatDateLong = (timestamp) => {
  const date = new Date(timestamp);
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Normalise une date au premier jour du mois à minuit
 */
export const normalizeToMonthStart = (date) => {
  const normalized = new Date(date);
  normalized.setDate(1);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Obtient la clé mois-année d'un timestamp (ex: "2024-01")
 */
export const getMonthKey = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Génère une plage de mois entre deux dates
 */
export const generateMonthRange = (startDate, endDate) => {
  const months = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    months.push({
      timestamp: current.getTime(),
      date: formatDateShort(current.getTime()),
      key: getMonthKey(current.getTime())
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};






