import { CONTRACT_TYPES, CONTRACT_STATUS } from '../constants';

/**
 * Calcule le MRR d'un contrat
 */
export const calculateMRR = (licenses, pricePerLicense) => {
  const numLicenses = parseInt(licenses) || 0;
  const price = parseFloat(pricePerLicense) || 0;
  return numLicenses * price;
};

/**
 * Détermine le type de contrat (Nouveau, Upsell, Cross-sell)
 */
export const determineContractType = (typeRaw) => {
  const normalized = (typeRaw || 'N').toString().trim().toUpperCase();
  
  if (normalized.includes('U') || normalized === 'U') {
    return CONTRACT_TYPES.UPSELL;
  } else if (normalized.includes('C') || normalized === 'C') {
    return CONTRACT_TYPES.CROSS_SELL;
  } else {
    return CONTRACT_TYPES.NEW;
  }
};

/**
 * Vérifie si un contrat est en churn
 */
export const isContractChurned = (endStatus) => {
  if (!endStatus) return false;
  const status = endStatus.toLowerCase();
  return status.includes('churn') || status.includes('end');
};

/**
 * Vérifie si un contrat est actif à une date donnée
 */
export const isContractActive = (contract, timestamp) => {
  const startTs = contract.start;
  const endTs = contract.end;
  
  if (!startTs || isNaN(startTs)) return false;
  if (startTs > timestamp) return false;
  if (endTs && !isNaN(endTs) && endTs <= timestamp) return false;
  
  return true;
};

/**
 * Parse une ligne de données brutes en contrat
 */
export const parseContractRow = (row) => {
  const startDateStr = row['Start Date'];
  const endDateStr = row['End date'] || row['End Date'];
  
  let startTs = startDateStr ? new Date(startDateStr).getTime() : null;
  let endTs = endDateStr ? new Date(endDateStr).getTime() : null;
  
  const mrr = calculateMRR(row['# License'], row['License Price']);
  const type = determineContractType(row['Up sell (U) or new client (N) or cross-sell (C)']);
  const currency = row['Devise'] || 'CAD';
  
  return {
    ...row,
    mrr,
    start: startTs,
    end: endTs,
    status: (row['End Status'] || row['Start Status'] || '').trim(),
    type,
    csm: row['CSM'] || 'Non assigné',
    ae: row['A/E'] || 'Non assigné',
    clientId: row['# client ID'],
    clientName: row['Nom'] || 'Inconnu',
    currency,
    contractNum: row['# contract'] || '?'
  };
};

/**
 * Filtre les contrats actifs à une date donnée
 */
export const getActiveContracts = (contracts, timestamp) => {
  return contracts.filter(contract => isContractActive(contract, timestamp));
};

/**
 * Obtient les contrats qui démarrent dans un mois donné
 */
export const getContractsStartingInMonth = (contracts, monthTimestamp) => {
  const monthStart = new Date(monthTimestamp);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartTs = monthStart.getTime();
  
  return contracts.filter(contract => {
    if (!contract.start) return false;
    const startDate = new Date(contract.start);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    return startDate.getTime() === monthStartTs;
  });
};

/**
 * Obtient les contrats qui se terminent dans un mois donné
 */
export const getContractsEndingInMonth = (contracts, monthTimestamp) => {
  const monthStart = new Date(monthTimestamp);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartTs = monthStart.getTime();
  
  return contracts.filter(contract => {
    if (!contract.end || !isContractChurned(contract.status)) return false;
    const endDate = new Date(contract.end);
    endDate.setDate(1);
    endDate.setHours(0, 0, 0, 0);
    return endDate.getTime() === monthStartTs;
  });
};






