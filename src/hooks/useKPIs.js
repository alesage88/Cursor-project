import { useMemo } from 'react';
import { getHistoricalRate } from '../utils/currency';
import { formatDateShort } from '../utils/dateUtils';
import { isContractActive, isContractChurned } from '../utils/contractUtils';

/**
 * Hook personnalisé pour calculer tous les KPIs de l'application
 */
export const useKPIs = (contracts, displayCurrency) => {
  return useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return {
        evolutionData: [],
        variationData: [],
        matrixHeaders: [],
        matrixRows: [],
        financialTable: [],
        totalMRR: 0,
        totalContracts: 0,
        activeContracts: 0,
        churnedContracts: 0,
        totalClients: 0,
        avgMRRPerClient: 0,
        totalLostMRR: 0,
        mrrByCSM: {},
        aePerformance: {},
        churnByCSM: {},
        churnByAE: {},
        churnTimeline: {},
        churnList: []
      };
    }

    // Trouver les dates min/max
    let minDate = Infinity;
    let maxDate = 0;
    
    contracts.forEach(c => {
      if (c.start && !isNaN(c.start)) {
        if (c.start < minDate) minDate = c.start;
        if (c.start > maxDate) maxDate = c.start;
      }
      if (c.end && !isNaN(c.end) && c.end > maxDate) {
        maxDate = c.end;
      }
    });

    if (minDate === Infinity) minDate = new Date().getTime();
    const nowTs = new Date().getTime();
    if (maxDate < nowTs) maxDate = nowTs;

    // Initialisation des structures de données
    const matrixHeaders = [];
    const matrixDataMap = {};
    const evolutionData = [];
    const variationDataMap = {};
    const financialTable = [];
    const mrrByCSM = {};
    const aePerformance = {};
    const clientAggregates = {};
    let totalLostMRR = 0;
    const churnByCSM = {};
    const churnByAE = {};
    const churnTimeline = {};
    const churnList = [];

    // Générer la plage de mois
    const currentDate = new Date(minDate);
    currentDate.setDate(1);
    currentDate.setHours(0, 0, 0, 0);

    const endDate = new Date(maxDate);
    endDate.setMonth(endDate.getMonth() + 1);

    while (currentDate <= endDate) {
      const monthTs = currentDate.getTime();
      const monthLabel = formatDateShort(monthTs);
      const targetRate = getHistoricalRate(displayCurrency, monthTs);

      matrixHeaders.push({ timestamp: monthTs, date: monthLabel });
      
      if (!variationDataMap[monthTs]) {
        variationDataMap[monthTs] = {
          date: monthLabel,
          ts: monthTs,
          timestamp: monthTs,
          New: 0,
          Upsell: 0,
          Cross: 0,
          Churn: 0
        };
      }

      const monthData = {
        date: monthLabel,
        timestamp: monthTs,
        Nouveau: 0,
        Upsell: 0,
        'Cross-sell': 0,
        TotalMRR: 0,
        ActiveContracts: 0,
        ActiveClients: 0
      };

      const monthlyClientIds = new Set();

      contracts.forEach(c => {
        // Contrats actifs ce mois
        if (c.start <= monthTs) {
          if (!c.end || c.end > monthTs) {
            const sourceToCadRate = getHistoricalRate(c.currency, monthTs);
            const mrrInCAD = c.mrr * sourceToCadRate;
            const mrrConverted = mrrInCAD / targetRate;

            if (monthData[c.type] !== undefined) {
              monthData[c.type] += mrrConverted;
            } else {
              monthData['Nouveau'] += mrrConverted;
            }

            monthData.TotalMRR += mrrConverted;
            monthData.ActiveContracts += 1;

            if (c.clientId) monthlyClientIds.add(c.clientId);

            // Matrice client
            const matKey = c.clientId || c.clientName;
            if (!matrixDataMap[matKey]) {
              matrixDataMap[matKey] = {
                id: matKey,
                name: c.clientName,
                total: 0,
                history: {},
                contracts: {}
              };
            }
            if (!matrixDataMap[matKey].history[monthTs]) {
              matrixDataMap[matKey].history[monthTs] = 0;
            }
            matrixDataMap[matKey].history[monthTs] += mrrConverted;

            const contractKey = c['# contract ID'] || `CT-${c.clientId}-${c.contractNum}`;
            if (!matrixDataMap[matKey].contracts[contractKey]) {
              matrixDataMap[matKey].contracts[contractKey] = {
                id: contractKey,
                name: `Contrat #${c.contractNum} (${c.type})`,
                history: {}
              };
            }
            if (!matrixDataMap[matKey].contracts[contractKey].history[monthTs]) {
              matrixDataMap[matKey].contracts[contractKey].history[monthTs] = 0;
            }
            matrixDataMap[matKey].contracts[contractKey].history[monthTs] += mrrConverted;
          }
        }

        // Variations mensuelles - Nouveaux contrats
        const startObj = new Date(c.start);
        startObj.setDate(1);
        startObj.setHours(0, 0, 0, 0);
        
        if (startObj.getTime() === monthTs) {
          const sourceToCadRate = getHistoricalRate(c.currency, monthTs);
          const mrrVal = (c.mrr * sourceToCadRate) / targetRate;

          if (c.type === 'Upsell' || c.type === 'U') {
            variationDataMap[monthTs].Upsell += mrrVal;
          } else if (c.type === 'Cross-sell' || c.type === 'C') {
            variationDataMap[monthTs].Cross += mrrVal;
          } else {
            variationDataMap[monthTs].New += mrrVal;
          }
        }

        // Variations mensuelles - Churn
        if (c.end && !isNaN(c.end)) {
          const status = c.status.toLowerCase();
          if (status.includes('churn') || status.includes('end')) {
            const endObj = new Date(c.end);
            endObj.setDate(1);
            endObj.setHours(0, 0, 0, 0);

            if (endObj.getTime() === monthTs) {
              const sourceToCadRate = getHistoricalRate(c.currency, monthTs);
              const mrrVal = (c.mrr * sourceToCadRate) / targetRate;
              variationDataMap[monthTs].Churn -= mrrVal;
            }
          }
        }
      });

      monthData.ActiveClients = monthlyClientIds.size;
      monthData.Nouveau = Math.round(monthData.Nouveau);
      monthData.Upsell = Math.round(monthData.Upsell);
      monthData['Cross-sell'] = Math.round(monthData['Cross-sell']);
      monthData.TotalMRR = Math.round(monthData.TotalMRR);
      evolutionData.push(monthData);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Finaliser variationData
    const variationData = Object.values(variationDataMap)
      .sort((a, b) => a.ts - b.ts)
      .map(d => ({
        ...d,
        New: Math.round(d.New),
        Upsell: Math.round(d.Upsell),
        Cross: Math.round(d.Cross),
        Churn: Math.round(d.Churn),
        Net: Math.round(d.New + d.Upsell + d.Cross + d.Churn)
      }));

    // Tableau financier
    evolutionData.forEach((evo, index) => {
      const vari = variationData.find(v => v.ts === evo.timestamp) || {
        New: 0,
        Upsell: 0,
        Cross: 0,
        Churn: 0,
        Net: 0
      };

      const beginningMRR = index > 0 ? evolutionData[index - 1].TotalMRR : 0;
      const endingMRR = evo.TotalMRR;
      const netGrowth = endingMRR - beginningMRR;
      const growthPercent = beginningMRR !== 0 ? (netGrowth / beginningMRR) * 100 : 0;

      const prevYearIndex = index - 12;
      let yyGrowth = 0;
      if (prevYearIndex >= 0) {
        const prevYearMRR = evolutionData[prevYearIndex].TotalMRR;
        yyGrowth = prevYearMRR !== 0 ? ((endingMRR - prevYearMRR) / prevYearMRR) * 100 : 0;
      }

      const churnRate = beginningMRR !== 0 ? (Math.abs(vari.Churn) / beginningMRR) * 100 : 0;

      financialTable.push({
        date: evo.date,
        timestamp: evo.timestamp,
        beginning: beginningMRR,
        churn: vari.Churn,
        upsell: vari.Upsell,
        newSales: vari.New,
        crossSell: vari.Cross,
        ending: endingMRR,
        growthAmt: netGrowth,
        growthPct: growthPercent,
        yyGrowth: yyGrowth,
        churnRate: churnRate
      });
    });

    // Matrice finale
    const currentMonthTs = new Date().getTime();
    const currentTargetRate = getHistoricalRate(displayCurrency, currentMonthTs);

    Object.values(matrixDataMap).forEach(client => {
      const lastTs = matrixHeaders.length > 0 ? matrixHeaders[matrixHeaders.length - 1].timestamp : 0;
      client.total = client.history[lastTs] || 0;
    });

    const matrixRows = Object.values(matrixDataMap).sort((a, b) => b.total - a.total);

    // Statistiques globales
    let totalContracts = 0;
    let activeContracts = 0;
    let churnedContracts = 0;
    const clientIds = new Set();

    contracts.forEach(c => {
      totalContracts++;
      const isChurn = c.status.toLowerCase().includes('churn') || c.status.toLowerCase().includes('end');
      const sourceToCadRate = getHistoricalRate(c.currency, currentMonthTs);
      const mrrConvertedNow = (c.mrr * sourceToCadRate) / currentTargetRate;

      if (c.clientId) clientIds.add(c.clientId);

      if (!isChurn && isContractActive(c, currentMonthTs)) {
        activeContracts++;

        // MRR par CSM
        if (!mrrByCSM[c.csm]) mrrByCSM[c.csm] = 0;
        mrrByCSM[c.csm] += mrrConvertedNow;

        // Performance AE
        if (!aePerformance[c.ae]) {
          aePerformance[c.ae] = { contracts: 0, mrr: 0, clients: new Set() };
        }
        aePerformance[c.ae].contracts++;
        aePerformance[c.ae].mrr += mrrConvertedNow;
        if (c.clientId) aePerformance[c.ae].clients.add(c.clientId);

        // Agrégation client
        const clientKey = c.clientId || c.clientName;
        if (!clientAggregates[clientKey]) {
          clientAggregates[clientKey] = { mrr: 0, name: c.clientName };
        }
        clientAggregates[clientKey].mrr += mrrConvertedNow;
      } else if (isChurn) {
        churnedContracts++;
        totalLostMRR += mrrConvertedNow;

        // Churn par CSM
        if (!churnByCSM[c.csm]) churnByCSM[c.csm] = { count: 0, mrr: 0 };
        churnByCSM[c.csm].count++;
        churnByCSM[c.csm].mrr += mrrConvertedNow;

        // Churn par AE
        if (!churnByAE[c.ae]) churnByAE[c.ae] = { count: 0, mrr: 0 };
        churnByAE[c.ae].count++;
        churnByAE[c.ae].mrr += mrrConvertedNow;

        // Timeline churn
        if (c.end) {
          const endDate = new Date(c.end);
          const monthKey = formatDateShort(c.end);
          if (!churnTimeline[monthKey]) churnTimeline[monthKey] = { count: 0, mrr: 0 };
          churnTimeline[monthKey].count++;
          churnTimeline[monthKey].mrr += mrrConvertedNow;
        }

        // Liste churn
        churnList.push({
          ...c,
          mrrConverted: mrrConvertedNow
        });
      }
    });

    const totalMRR = evolutionData.length > 0 ? evolutionData[evolutionData.length - 1].TotalMRR : 0;
    const totalClients = clientIds.size;
    const avgMRRPerClient = totalClients > 0 ? totalMRR / totalClients : 0;

    return {
      evolutionData,
      variationData,
      matrixHeaders,
      matrixRows,
      financialTable,
      totalMRR,
      totalContracts,
      activeContracts,
      churnedContracts,
      totalClients,
      avgMRRPerClient,
      totalLostMRR,
      mrrByCSM,
      aePerformance,
      churnByCSM,
      churnByAE,
      churnTimeline,
      churnList,
      clientAggregates
    };
  }, [contracts, displayCurrency]);
};






