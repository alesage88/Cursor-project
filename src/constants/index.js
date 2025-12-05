// Devises et taux de change
export const CURRENCIES = ['CAD', 'USD', 'EUR'];

export const EXCHANGE_RATES = {
  CAD: { USD: 0.73, EUR: 0.68 },
  USD: { CAD: 1.37, EUR: 0.93 },
  EUR: { CAD: 1.47, USD: 1.08 }
};

export const CURRENCY_SYMBOLS = {
  CAD: '$',
  USD: '$',
  EUR: '€'
};

// Taux de change historiques
export const HISTORICAL_RATES = {
  '2023-01': { CAD: { USD: 0.74, EUR: 0.69 }, USD: { CAD: 1.35, EUR: 0.93 }, EUR: { CAD: 1.45, USD: 1.08 } },
  '2023-02': { CAD: { USD: 0.74, EUR: 0.69 }, USD: { CAD: 1.35, EUR: 0.93 }, EUR: { CAD: 1.45, USD: 1.08 } },
  '2023-03': { CAD: { USD: 0.73, EUR: 0.68 }, USD: { CAD: 1.37, EUR: 0.93 }, EUR: { CAD: 1.47, USD: 1.07 } },
  '2023-04': { CAD: { USD: 0.74, EUR: 0.67 }, USD: { CAD: 1.36, EUR: 0.91 }, EUR: { CAD: 1.49, USD: 1.10 } },
  '2023-05': { CAD: { USD: 0.74, EUR: 0.69 }, USD: { CAD: 1.35, EUR: 0.93 }, EUR: { CAD: 1.45, USD: 1.07 } },
  '2023-06': { CAD: { USD: 0.76, EUR: 0.69 }, USD: { CAD: 1.32, EUR: 0.92 }, EUR: { CAD: 1.45, USD: 1.09 } },
  '2023-07': { CAD: { USD: 0.76, EUR: 0.68 }, USD: { CAD: 1.32, EUR: 0.90 }, EUR: { CAD: 1.47, USD: 1.11 } },
  '2023-08': { CAD: { USD: 0.74, EUR: 0.68 }, USD: { CAD: 1.35, EUR: 0.92 }, EUR: { CAD: 1.47, USD: 1.09 } },
  '2023-09': { CAD: { USD: 0.74, EUR: 0.69 }, USD: { CAD: 1.35, EUR: 0.94 }, EUR: { CAD: 1.45, USD: 1.07 } },
  '2023-10': { CAD: { USD: 0.73, EUR: 0.69 }, USD: { CAD: 1.37, EUR: 0.94 }, EUR: { CAD: 1.45, USD: 1.06 } },
  '2023-11': { CAD: { USD: 0.73, EUR: 0.67 }, USD: { CAD: 1.37, EUR: 0.92 }, EUR: { CAD: 1.49, USD: 1.09 } },
  '2023-12': { CAD: { USD: 0.75, EUR: 0.68 }, USD: { CAD: 1.33, EUR: 0.91 }, EUR: { CAD: 1.47, USD: 1.10 } },
  '2024-01': { CAD: { USD: 0.75, EUR: 0.69 }, USD: { CAD: 1.34, EUR: 0.92 }, EUR: { CAD: 1.45, USD: 1.09 } },
  '2024-02': { CAD: { USD: 0.74, EUR: 0.69 }, USD: { CAD: 1.35, EUR: 0.93 }, EUR: { CAD: 1.45, USD: 1.08 } },
  '2024-03': { CAD: { USD: 0.74, EUR: 0.68 }, USD: { CAD: 1.35, EUR: 0.92 }, EUR: { CAD: 1.47, USD: 1.09 } },
  '2024-04': { CAD: { USD: 0.73, EUR: 0.68 }, USD: { CAD: 1.37, EUR: 0.93 }, EUR: { CAD: 1.47, USD: 1.08 } },
  '2024-05': { CAD: { USD: 0.73, EUR: 0.67 }, USD: { CAD: 1.37, EUR: 0.92 }, EUR: { CAD: 1.49, USD: 1.09 } },
  '2024-06': { CAD: { USD: 0.73, EUR: 0.68 }, USD: { CAD: 1.37, EUR: 0.93 }, EUR: { CAD: 1.47, USD: 1.08 } },
  '2024-07': { CAD: { USD: 0.73, EUR: 0.67 }, USD: { CAD: 1.37, EUR: 0.92 }, EUR: { CAD: 1.49, USD: 1.09 } },
  '2024-08': { CAD: { USD: 0.73, EUR: 0.66 }, USD: { CAD: 1.37, EUR: 0.90 }, EUR: { CAD: 1.52, USD: 1.11 } },
  '2024-09': { CAD: { USD: 0.74, EUR: 0.67 }, USD: { CAD: 1.35, EUR: 0.91 }, EUR: { CAD: 1.49, USD: 1.10 } },
  '2024-10': { CAD: { USD: 0.72, EUR: 0.66 }, USD: { CAD: 1.39, EUR: 0.92 }, EUR: { CAD: 1.52, USD: 1.09 } },
  '2024-11': { CAD: { USD: 0.71, EUR: 0.67 }, USD: { CAD: 1.41, EUR: 0.95 }, EUR: { CAD: 1.49, USD: 1.05 } },
  '2024-12': { CAD: { USD: 0.70, EUR: 0.67 }, USD: { CAD: 1.43, EUR: 0.95 }, EUR: { CAD: 1.49, USD: 1.05 } }
};

// Formats de date
export const DATE_FORMATS = {
  SHORT: 'MMM yy',
  LONG: 'MMMM yyyy',
  ISO: 'yyyy-MM-dd'
};

// Types de contrats
export const CONTRACT_TYPES = {
  NEW: 'Nouveau',
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  CHURN: 'Churn'
};

// Statuts de contrats
export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  CHURN: 'churn',
  END: 'end'
};

// Colonnes Excel pour l'import
export const EXCEL_COLUMNS = [
  'Nom', '# client ID', '# contract', '# contract ID', 'Commentaire', 'A/E', 'CSM', 'Partenaire',
  'Start Status', 'Signed Date', 'Start Date', 'Up sell (U) or new client (N) or cross-sell (C)',
  'Aug. / y (%)', 'date augmentation', 'End Status', 'End date', 'Pays', 'Devise', '# License',
  'License Price', 'MRR'
];

// Configuration par défaut
export const DEFAULT_CONFIG = {
  currencies: ['CAD', 'USD', 'EUR'],
  defaultCurrency: 'CAD'
};

// Données de démonstration
export const DEMO_DATA = [
  {
    'Nom': 'Abbott', '# client ID': '1', '# contract': '1', '# contract ID': '1-1', 'Commentaire': '',
    'A/E': 'John Doe', 'CSM': 'Alice Smith', 'Partenaire': '', 'Start Status': 'Active', 'Signed Date': '2023-01-10',
    'Start Date': '2023-02-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'Canada', 'Devise': 'CAD',
    '# License': '10', 'License Price': '50', 'MRR': '500'
  },
  {
    'Nom': 'Abbott', '# client ID': '2', '# contract': '2', '# contract ID': '2-1', 'Commentaire': '',
    'A/E': 'Jane Smith', 'CSM': 'Bob Johnson', 'Partenaire': '', 'Start Status': 'Active', 'Signed Date': '2023-06-15',
    'Start Date': '2023-07-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'USA', 'Devise': 'USD',
    '# License': '20', 'License Price': '45', 'MRR': '900'
  },
  {
    'Nom': 'Abipa', '# client ID': '3', '# contract': '1', '# contract ID': '3-1', 'Commentaire': '',
    'A/E': 'John Doe', 'CSM': 'Alice Smith', 'Partenaire': 'Partner A', 'Start Status': 'Active', 'Signed Date': '2023-03-20',
    'Start Date': '2023-04-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'France', 'Devise': 'EUR',
    '# License': '15', 'License Price': '55', 'MRR': '825'
  },
  {
    'Nom': 'Abipa', '# client ID': '3', '# contract': '2', '# contract ID': '3-2', 'Commentaire': 'Upsell package',
    'A/E': 'John Doe', 'CSM': 'Alice Smith', 'Partenaire': 'Partner A', 'Start Status': 'Active', 'Signed Date': '2023-09-10',
    'Start Date': '2023-10-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'U', 'Aug. / y (%)': '10',
    'date augmentation': '2024-10-01', 'End Status': '', 'End date': '', 'Pays': 'France', 'Devise': 'EUR',
    '# License': '5', 'License Price': '55', 'MRR': '275'
  },
  {
    'Nom': 'Acme Corp', '# client ID': '4', '# contract': '1', '# contract ID': '4-1', 'Commentaire': '',
    'A/E': 'Jane Smith', 'CSM': 'Bob Johnson', 'Partenaire': '', 'Start Status': 'Active', 'Signed Date': '2024-01-05',
    'Start Date': '2024-02-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': 'Churn', 'End date': '2024-08-31', 'Pays': 'Canada', 'Devise': 'CAD',
    '# License': '8', 'License Price': '60', 'MRR': '480'
  },
  {
    'Nom': 'TechStart Inc', '# client ID': '5', '# contract': '1', '# contract ID': '5-1', 'Commentaire': '',
    'A/E': 'Mike Brown', 'CSM': 'Carol White', 'Partenaire': 'Partner B', 'Start Status': 'Active', 'Signed Date': '2023-05-12',
    'Start Date': '2023-06-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'USA', 'Devise': 'USD',
    '# License': '25', 'License Price': '40', 'MRR': '1000'
  },
  {
    'Nom': 'Global Solutions', '# client ID': '6', '# contract': '1', '# contract ID': '6-1', 'Commentaire': '',
    'A/E': 'Sarah Lee', 'CSM': 'David Chen', 'Partenaire': '', 'Start Status': 'Active', 'Signed Date': '2023-08-20',
    'Start Date': '2023-09-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'N', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'Canada', 'Devise': 'CAD',
    '# License': '30', 'License Price': '35', 'MRR': '1050'
  },
  {
    'Nom': 'Global Solutions', '# client ID': '6', '# contract': '2', '# contract ID': '6-2', 'Commentaire': 'Cross-sell module',
    'A/E': 'Sarah Lee', 'CSM': 'David Chen', 'Partenaire': '', 'Start Status': 'Active', 'Signed Date': '2024-03-15',
    'Start Date': '2024-04-01', 'Up sell (U) or new client (N) or cross-sell (C)': 'C', 'Aug. / y (%)': '',
    'date augmentation': '', 'End Status': '', 'End date': '', 'Pays': 'Canada', 'Devise': 'CAD',
    '# License': '10', 'License Price': '50', 'MRR': '500'
  }
];






