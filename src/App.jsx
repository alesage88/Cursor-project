import React, { useState, useEffect, useMemo, useRef } from 'react';
import dataManager from './dataManager';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  FileSpreadsheet, 
  Upload, 
  DollarSign,
  AlertCircle,
  Briefcase,
  Calendar,
  BarChart2,
  LineChart as LineChartIcon,
  Award,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  UserX,
  AlertTriangle,
  Plus,
  X,
  Save,
  Trophy,
  GripVertical,
  Globe,
  Activity,
  Download,
  Hash,
  CheckCircle,
  UserPlus,
  User,
  Database,
  Edit,   
  Trash2,
  Settings,
  List,
  RefreshCw,
  Eye,
  HardDrive,
  Shield,
  FileDown,
  FileUp 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Brush,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';

// --- Composants UI de base ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtext, icon: Icon, trend, colorClass = "text-blue-600 bg-blue-50" }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        {Icon && <Icon size={18} />}
      </div>
    </div>
    <div className="flex items-baseline mb-1">
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
    <div className="flex items-center text-sm">
      {trend && (
        <span className={`flex items-center font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
      <span className="text-gray-400 ml-2">{subtext}</span>
    </div>
  </Card>
);

// --- Composant de Gestion de Liste (Configuration) ---
const ConfigList = ({ title, items, onAdd, onDelete, placeholder = "Nouvel élément..." }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <Card className="p-4 h-full flex flex-col">
      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <List size={16} className="text-blue-500"/> {title}
      </h4>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button 
          onClick={handleAdd}
          className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 max-h-48">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 group text-sm">
            <span className="text-gray-700">{item}</span>
            <button 
              onClick={() => onDelete(item)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 italic text-center py-2">Aucun élément</p>}
      </div>
    </Card>
  );
};

// --- Moteur de Taux de Change Simulé ---
const getHistoricalRate = (currency, timestamp) => {
  if (!currency || currency === 'CAD') return 1;
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth(); 
  // Simulation: USD varie autour de 1.30, EUR autour de 1.45
  if (currency === 'USD') return 1.30 + (year - 2016) * 0.01 + Math.sin(month) * 0.02; 
  if (currency === 'EUR') return 1.45 + (year - 2016) * 0.015 + Math.cos(month) * 0.02;
  return 1; 
};

const getCurrencySymbol = (currency) => {
  switch(currency) {
    case 'EUR': return '€';
    case 'USD': return '$'; 
    case 'CAD': return '$';
    default: return '$';
  }
};

// --- Données simulées ---
const SAMPLE_CSV_DATA = `Nom,# client ID,# contract,# contract ID,Commentaire,A/E,CSM,Partenaire,Start Status,Signed Date,Start Date,Up sell (U) or new client (N) or cross-sell (C),Aug. / y (%),date augmentation,End Status,End date,Pays,Devise,# License,License Price,MRR 
3R RECHERCHES & RÉALISATIONS RÉMY,1,1,000101,,Lucas Grenier,Samuel Bisson,Top-Tech,Signed,2020-01-01,2020-01-01,N,,,Churn,2020-05-01,,EUR,1,638,638
Abbott : Casa Grande plant - 1,2,1,000201,,Lucas Grenier,,,Signed,2024-11-14,2024-11-18,N,,,,,,CAD,1,2453.48,2453.48
Abipa - 3700 Avenue Des Grandes Tourelles - 1,3,1,000301,,Rémi Taurines,Anthony Lesage,Progima,Signed,,2018-08-23,N,,,,,,CAD,4,250,1000
Wire Mesh Corp - 2,209,1,020901,,,Simon Rochette,,Signed,2025-10-01,2025-10-07,N,,,,,,CAD,1,280,280
Ville de Longueuil:021-20,45,1,004501,,Lucas Grenier,Anthony Lesage,,Signed,2016-01-01,2016-01-01,N,,,,Active,,CAD,CAD,5,300,1500
Mayback,46,1,004601,,,Emile Brabant,,Renew,2017-02-01,2017-02-01,N,,,,Active,,USD,USD,10,150,1500
Cascades Canada:034-21,47,1,004701,,Rémi Taurines,Julien Hébert,,Signed,2017-06-01,2017-06-01,N,,,,Active,,EUR,EUR,2,800,1600
Béton Provincial:038-23,48,1,004801,,Eric Lacourcière,Charles-Éric Gauthier,,Signed,2018-01-15,2018-01-15,N,,,,Active,,CAD,CAD,3,500,1500
Abipa - 3700 Avenue Des Grandes Tourelles - 2,3,2,000302,,Rémi Taurines,Anthony Lesage,,Signed,2021-01-28,2021-07-01,U,,,,,,CAD,1,500,500
Wiptec - 1,208,1,020801,,Simon Rochette,Charles-Éric Gauthier,,Signed,2022-02-21,2022-03-01,N,,,Churn,2022-09-01,,CAD,1,900,900`;

// --- LOGIQUE DE PARSING ---
const processRawRows = (rows) => {
  if (!rows || rows.length === 0) return [];
  let headerIndex = 0;
  if (rows[0] && rows[0][0] && rows[0][0].toString().toLowerCase().includes('min row')) {
    headerIndex = 3;
  }
  if (rows.length <= headerIndex) return [];
  const headers = rows[headerIndex].map(h => h ? h.toString().trim() : '');
  return rows.slice(headerIndex + 1).map(row => {
    const entry = {};
    headers.forEach((header, index) => {
      const cleanHeader = header.replace(/[\r\n]+/g, '').trim();
      const val = row[index] !== undefined && row[index] !== null ? row[index].toString() : '';
      entry[cleanHeader] = val.replace(/['"]+/g, '');
      entry[`__col_${index}`] = val;
    });
    const rawMrr = entry['__col_20'] || entry['MRR'] || entry['MRR '] || '0';
    entry.mrr_calc = parseFloat(rawMrr.replace(/[^0-9.-]/g, '')) || 0;
    return entry;
  });
};

const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const rows = lines.map(line => {
    let values = [];
    let currentVal = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else currentVal += char;
    }
    values.push(currentVal.trim());
    return values;
  });
  return processRawRows(rows);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('licences'); 
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'mrr_calc', direction: 'desc' });
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [excelLibReady, setExcelLibReady] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false); 
  
  const [displayCurrency, setDisplayCurrency] = useState('CAD');
  const [clientColumnWidth, setClientColumnWidth] = useState(250); 
  const [expandedClientRows, setExpandedClientRows] = useState(new Set());
  const [configSubTab, setConfigSubTab] = useState('general');
  const [drillDownData, setDrillDownData] = useState(null);

  // --- CONFIGURATION STATE ---
  const [config, setConfig] = useState({
    partners: [],
    aes: [],
    csms: [],
    salesTypes: ['N', 'U', 'C'], 
    currencies: ['CAD', 'USD', 'EUR'],
    startStatuses: ['Signed', 'Active', 'Renew'],
    endStatuses: ['Active', 'Churn', 'End']
  });

  // --- Gestion du Resize ---
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const startResize = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = clientColumnWidth;
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
  };

  const doResize = (e) => {
    if (!resizingRef.current) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(100, startWidthRef.current + diff); 
    setClientColumnWidth(newWidth);
  };

  const stopResize = () => {
    resizingRef.current = false;
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = 'default';
  };

  // --- Modals State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isNewClientMode, setIsNewClientMode] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null); 
  
  const initialContractState = {
    Nom: '',
    '# client ID': '',
    '# contract': '1',
    '# contract ID': '',
    Commentaire: '',
    'A/E': '',
    CSM: '',
    Partenaire: '',
    'Start Status': 'Signed',
    'Signed Date': '',
    'Start Date': new Date().toISOString().split('T')[0],
    type: 'N', 
    'Aug. / y (%)': '',
    'date augmentation': '',
    'End Status': '',
    'End date': '',
    Pays: '',
    Devise: 'CAD',
    '# License': '',
    'License Price': '',
    mrr_calc: 0
  };
  
  const [newContract, setNewContract] = useState(initialContractState);

  // --- Helpers Config ---
  const extractConfigFromData = (data) => {
    const partners = new Set();
    const aes = new Set();
    const csms = new Set();
    data.forEach(row => {
      if(row['Partenaire']) partners.add(row['Partenaire']);
      if(row['A/E']) aes.add(row['A/E']);
      if(row['CSM']) csms.add(row['CSM']);
    });
    setConfig(prev => ({
      ...prev,
      partners: Array.from(partners).filter(Boolean).sort(),
      aes: Array.from(aes).filter(Boolean).sort(),
      csms: Array.from(csms).filter(Boolean).sort(),
    }));
  };

  // --- Helper pour sauvegarder les données ---
  const updateAndSaveData = (newData) => {
    setRawData(newData);
    dataManager.updateContracts(newData);
  };

  // --- Helper pour sauvegarder la configuration ---
  const updateAndSaveConfig = (newConfig) => {
    setConfig(newConfig);
    dataManager.updateConfig(newConfig);
  };

  // --- Effets d'initialisation ---
  useEffect(() => {
    if (window.XLSX) { setExcelLibReady(true); return; }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    script.onload = () => setExcelLibReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    // Initialiser le Data Manager
    const storedData = dataManager.initialize();
    
    // Charger les contrats depuis le stockage
    const loadedContracts = dataManager.getContracts();
    const loadedConfig = dataManager.getConfig();
    
    // IMPORTANT: Vérifier si des données utilisateur existent
    if (loadedContracts && loadedContracts.length > 0) {
      // Données utilisateur trouvées - les charger
      console.log(`✅ ${loadedContracts.length} contrats chargés depuis le stockage local`);
      setRawData(loadedContracts);
      setFilteredData(loadedContracts);
      setConfig(loadedConfig);
      setIsFileUploaded(true); // Marquer comme ayant des données réelles
    } else {
      // Pas de données utilisateur - charger les données demo
      console.log('📋 Mode démo - Chargement des données de démonstration');
      const demoData = parseCSV(SAMPLE_CSV_DATA);
      setRawData(demoData);
      setFilteredData(demoData);
      extractConfigFromData(demoData);
      // IMPORTANT: Ne pas sauvegarder les données demo automatiquement
      // Les données ne seront sauvegardées que si l'utilisateur importe ses propres données
    }
    
    // Log des informations de déploiement
    const deployInfo = dataManager.getDeploymentInfo();
    console.log('📊 Info déploiement:', deployInfo);
  }, []);

  useEffect(() => {
    let result = [...rawData];
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => 
          val && val.toString().toLowerCase().includes(lowerTerm)
        )
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'clientTotal') return 0;
        
        const strA = valA ? valA.toString().toLowerCase() : '';
        const strB = valB ? valB.toString().toLowerCase() : '';
        
        if (sortConfig.key === 'mrr_calc' || sortConfig.key === '# License') {
             const numA = parseFloat(valA) || 0;
             const numB = parseFloat(valB) || 0;
             if (numA < numB) return sortConfig.direction === 'asc' ? -1 : 1;
             if (numA > numB) return sortConfig.direction === 'asc' ? 1 : -1;
        } else {
             if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
             if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredData(result);
  }, [searchTerm, rawData, sortConfig]);

  // --- Helpers ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const uniqueClients = useMemo(() => {
    const clients = new Map();
    rawData.forEach(row => {
      if (row['# client ID'] && row['Nom']) {
        clients.set(row['# client ID'], row['Nom']);
      }
    });
    return Array.from(clients.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [rawData]);

  const calculateIds = (isNew, clientId = null) => {
    let newClientId = clientId;
    let newContractNum = 1;
    if (isNew) {
        let maxId = 0;
        rawData.forEach(row => {
            const id = parseInt(row['# client ID']);
            if (!isNaN(id) && id > maxId) maxId = id;
        });
        newClientId = (maxId + 1).toString();
        newContractNum = 1;
    } else {
        let maxContract = 0;
        rawData.forEach(row => {
             if (row['# client ID'] === clientId) {
                 const cNum = parseInt(row['# contract']);
                 if (!isNaN(cNum) && cNum > maxContract) maxContract = cNum;
             }
        });
        newContractNum = maxContract + 1;
    }
    const prefix = newClientId ? newClientId.toString().padStart(4, '0') : '0000';
    const suffix = newContractNum.toString().padStart(2, '0');
    const newContractId = `${prefix}${suffix}`;
    return {
        clientId: newClientId,
        contractNum: newContractNum.toString(),
        contractId: newContractId
    };
  };

  const openAddModal = () => {
    setEditingIndex(null); 
    setIsNewClientMode(true);
    const ids = calculateIds(true);
    setNewContract({
        ...initialContractState,
        '# client ID': ids.clientId,
        '# contract': ids.contractNum,
        '# contract ID': ids.contractId
    });
    setShowAddModal(true);
  };

  const handleClientSelect = (e) => {
      const selectedClientId = e.target.value;
      const selectedClientName = uniqueClients.find(c => c.id === selectedClientId)?.name || '';
      const ids = calculateIds(false, selectedClientId);
      setNewContract(prev => ({
          ...prev,
          Nom: selectedClientName,
          '# client ID': ids.clientId,
          '# contract': ids.contractNum,
          '# contract ID': ids.contractId
      }));
  };

  const toggleClientMode = (isNew) => {
      setIsNewClientMode(isNew);
      if (isNew) {
          const ids = calculateIds(true);
          setNewContract(prev => ({
              ...prev,
              Nom: '',
              '# client ID': ids.clientId,
              '# contract': ids.contractNum,
              '# contract ID': ids.contractId
          }));
      } else {
          setNewContract(prev => ({
            ...prev,
            Nom: '',
            '# client ID': '',
            '# contract': '',
            '# contract ID': ''
        }));
      }
  };

  const handleEditContract = (row) => {
    const index = rawData.indexOf(row);
    if (index === -1) return;
    setEditingIndex(index);
    setIsNewClientMode(false); 
    setNewContract({
      ...initialContractState,
      ...row, 
      mrr_calc: parseFloat(row.mrr_calc || 0)
    });
    setShowAddModal(true);
  };

  const handleDeleteContract = (row) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le contrat ${row['# contract ID']} pour ${row['Nom']} ?`)) {
      const index = rawData.indexOf(row);
      if (index > -1) {
        const newData = [...rawData];
        newData.splice(index, 1);
        updateAndSaveData(newData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleSaveContract = (e) => {
    e.preventDefault();
    const contractToSave = {
      ...newContract,
      'Up sell (U) or new client (N) or cross-sell (C)': newContract.type,
      'MRR': newContract.mrr_calc, 
      'MRR ': newContract.mrr_calc,
      '# client ID': newContract['# client ID'] 
    };
    let updatedData;
    if (editingIndex !== null) {
      updatedData = [...rawData];
      updatedData[editingIndex] = contractToSave;
    } else {
      updatedData = [...rawData, contractToSave];
    }
    updateAndSaveData(updatedData);
    setShowAddModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleClientExpansion = (clientKey) => {
      setExpandedClientRows(prev => {
          const newSet = new Set(prev);
          if (newSet.has(clientKey)) {
              newSet.delete(clientKey);
          } else {
              newSet.add(clientKey);
          }
          return newSet;
      });
  };

  const addToConfig = (listName, item) => {
      const newConfig = {
          ...config,
          [listName]: [...config[listName], item].sort()
      };
      updateAndSaveConfig(newConfig);
  };

  const removeFromConfig = (listName, item) => {
      const newConfig = {
          ...config,
          [listName]: config[listName].filter(i => i !== item)
      };
      updateAndSaveConfig(newConfig);
  };

  // --- CLICK SUR GRAPHIQUE VARIATION ---
  const handleVariationChartClick = (data) => {
    // Gérer les deux formats de données : clic sur Bar ou sur ComposedChart
    if (!data) return;
    
    let payload;
    
    // Format 1 : Clic direct sur une barre (data.payload existe)
    if (data.payload) {
      payload = data.payload;
    }
    // Format 2 : Clic via le graphique (data.activePayload existe)
    else if (data.activePayload && data.activePayload.length > 0) {
      payload = data.activePayload[0].payload;
    }
    // Pas de données valides
    else {
      return;
    }
    
    const monthTs = payload.timestamp || payload.ts; 
    const monthLabel = payload.date;
    
    // Vérifier que nous avons des données valides
    if (!monthTs || !monthLabel) return;

    const contractsForMonth = [];
    const targetRate = getHistoricalRate(displayCurrency, monthTs);

    rawData.forEach(c => {
       // 1. Mouvements Positifs (Nouveaux contrats)
       const startDateStr = c['Start Date'];
       if (startDateStr) {
         const startObj = new Date(startDateStr);
         startObj.setDate(1); 
         startObj.setHours(0,0,0,0);
         
         if (startObj.getTime() === monthTs) {
             const sourceRate = getHistoricalRate(c['Devise'] || 'CAD', monthTs);
             const mrrVal = (parseFloat(c.mrr_calc || 0) * sourceRate) / targetRate;
             
             // Détection améliorée du type
             let type = 'Nouveau';
             const typeRaw = (c['Up sell (U) or new client (N) or cross-sell (C)'] || 'N').toString().trim().toUpperCase();
             
             if (typeRaw.includes('U') || typeRaw === 'U') {
               type = 'Upsell';
             } else if (typeRaw.includes('C') || typeRaw === 'C') {
               type = 'Cross-sell';
             } else {
               type = 'Nouveau'; // Par défaut N ou autre
             }

             contractsForMonth.push({
               ...c,
               displayType: type,
               displayAmount: mrrVal,
               isChurn: false
             });
         }
       }

       // 2. Mouvements Négatifs (Churn)
       const endDateStr = c['End date'] || c['End Date'];
       if (endDateStr) {
           const status = (c['End Status'] || '').toLowerCase();
           if (status.includes('churn') || status.includes('end')) {
               const endObj = new Date(endDateStr);
               endObj.setDate(1); 
               endObj.setHours(0,0,0,0);
               
               if (endObj.getTime() === monthTs) {
                   const sourceRate = getHistoricalRate(c['Devise'] || 'CAD', monthTs);
                   const mrrVal = (parseFloat(c.mrr_calc || 0) * sourceRate) / targetRate;
                   
                   contractsForMonth.push({
                     ...c,
                     displayType: 'Churn',
                     displayAmount: -mrrVal,
                     isChurn: true
                   });
               }
           }
       }
    });

    setDrillDownData({ month: monthLabel, contracts: contractsForMonth });
  };

  // --- LOGIQUE DE CALCUL ---
  const kpis = useMemo(() => {
    let totalMRR = 0;
    let churnCount = 0;
    let totalContracts = 0;
    const activeClientIDs = new Set();
    const mrrByCSM = {};
    const aePerformance = {};
    const clientAggregates = {};
    let totalLostMRR = 0;
    const churnByCSM = {};
    const churnByAE = {};
    const churnTimeline = {}; 
    const churnList = []; 
    let minDate = Infinity;
    let maxDate = 0; 
    const contracts = rawData.map(row => {
      const startDateStr = row['Start Date'];
      const endDateStr = row['End date'] || row['End Date'];
      let startTs = startDateStr ? new Date(startDateStr).getTime() : null;
      let endTs = endDateStr ? new Date(endDateStr).getTime() : null;
      if (startTs && !isNaN(startTs)) {
        if (startTs < minDate) minDate = startTs;
        if (startTs > maxDate) maxDate = startTs;
      }
      if (endTs && !isNaN(endTs) && endTs > maxDate) maxDate = endTs;
      const typeRaw = (row['Up sell (U) or new client (N) or cross-sell (C)'] || 'N').toString().trim().toUpperCase();
      let type = 'Nouveau'; 
      // Utiliser if/else if pour éviter l'écrasement
      if (typeRaw.includes('U') || typeRaw === 'U') {
        type = 'Upsell';
      } else if (typeRaw.includes('C') || typeRaw === 'C') {
        type = 'Cross-sell';
      } else {
        type = 'Nouveau'; // Par défaut pour 'N' ou autre valeur
      }
      const contractCurrency = row['Devise'] || 'CAD';
      return {
        ...row, mrr: row.mrr_calc || 0, start: startTs, end: endTs, status: (row['End Status'] || row['Start Status'] || '').trim(), type: type, csm: row['CSM'] || 'Non assigné', ae: row['A/E'] || 'Non assigné', clientId: row['# client ID'], clientName: row['Nom'] || 'Inconnu', currency: contractCurrency, contractNum: row['# contract'] || '?'
      };
    });
    if (minDate === Infinity) minDate = new Date().getTime();
    const nowTs = new Date().getTime();
    if (maxDate < nowTs) maxDate = nowTs;
    const matrixHeaders = []; const matrixDataMap = {}; const evolutionData = []; const variationDataMap = {}; const financialTable = []; 
    if (contracts.length > 0) {
      let currentDate = new Date(minDate); currentDate.setDate(1); 
      const limitDate = new Date(maxDate);
      while (currentDate <= limitDate) {
        const monthTs = currentDate.getTime();
        const monthLabel = currentDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        matrixHeaders.push({ label: monthLabel, timestamp: monthTs });
        const targetRate = getHistoricalRate(displayCurrency, monthTs); 
        const monthData = { date: monthLabel, timestamp: monthTs, Nouveau: 0, Upsell: 0, 'Cross-sell': 0, TotalMRR: 0, ActiveClients: 0, ActiveContracts: 0 };
        if(!variationDataMap[monthTs]) { variationDataMap[monthTs] = { date: monthLabel, ts: monthTs, New: 0, Upsell: 0, Cross: 0, Churn: 0, Net: 0 }; }
        const monthlyClientIds = new Set();
        contracts.forEach(c => {
          if (!c.start || isNaN(c.start)) return;
          if (c.start <= monthTs) {
             if (!c.end || c.end > monthTs) {
                const sourceToCadRate = getHistoricalRate(c.currency, monthTs);
                const mrrInCAD = c.mrr * sourceToCadRate;
                const mrrConverted = mrrInCAD / targetRate;
                if (monthData[c.type] !== undefined) { monthData[c.type] += mrrConverted; } else { monthData['Nouveau'] += mrrConverted; }
                monthData.TotalMRR += mrrConverted; monthData.ActiveContracts += 1; if (c.clientId) monthlyClientIds.add(c.clientId);
                const matKey = c.clientId || c.clientName;
                if (!matrixDataMap[matKey]) { matrixDataMap[matKey] = { id: matKey, name: c.clientName, total: 0, history: {}, contracts: {} }; }
                if (!matrixDataMap[matKey].history[monthTs]) { matrixDataMap[matKey].history[monthTs] = 0; }
                matrixDataMap[matKey].history[monthTs] += mrrConverted;
                const contractKey = c['# contract ID'] || `CT-${c.clientId}-${c.contractNum}`;
                if (!matrixDataMap[matKey].contracts[contractKey]) { matrixDataMap[matKey].contracts[contractKey] = { id: contractKey, name: `Contrat #${c.contractNum} (${c.type})`, history: {} }; }
                if (!matrixDataMap[matKey].contracts[contractKey].history[monthTs]) { matrixDataMap[matKey].contracts[contractKey].history[monthTs] = 0; }
                matrixDataMap[matKey].contracts[contractKey].history[monthTs] += mrrConverted;
             }
          }
          const startObj = new Date(c.start); startObj.setDate(1); startObj.setHours(0,0,0,0);
          if (startObj.getTime() === monthTs) {
             const sourceToCadRate = getHistoricalRate(c.currency, monthTs); const mrrVal = (c.mrr * sourceToCadRate) / targetRate;
             // Logique améliorée de détection du type
             if (c.type === 'Upsell' || c.type === 'U') {
               variationDataMap[monthTs].Upsell += mrrVal;
             } else if (c.type === 'Cross-sell' || c.type === 'C') {
               variationDataMap[monthTs].Cross += mrrVal;
             } else {
               // Par défaut (Nouveau, N, ou autre)
               variationDataMap[monthTs].New += mrrVal;
             }
          }
          if (c.end && !isNaN(c.end)) {
             const status = c.status.toLowerCase();
             if (status.includes('churn') || status.includes('end')) {
                 const endObj = new Date(c.end); endObj.setDate(1); endObj.setHours(0,0,0,0);
                 if (endObj.getTime() === monthTs) {
                     const sourceToCadRate = getHistoricalRate(c.currency, monthTs); const mrrVal = (c.mrr * sourceToCadRate) / targetRate; variationDataMap[monthTs].Churn -= mrrVal; 
                 }
             }
          }
        });
        monthData.ActiveClients = monthlyClientIds.size; monthData.Nouveau = Math.round(monthData.Nouveau); monthData.Upsell = Math.round(monthData.Upsell); monthData['Cross-sell'] = Math.round(monthData['Cross-sell']); monthData.TotalMRR = Math.round(monthData.TotalMRR); evolutionData.push(monthData); currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    const variationData = Object.values(variationDataMap).sort((a, b) => a.ts - b.ts).map(d => ({ ...d, New: Math.round(d.New), Upsell: Math.round(d.Upsell), Cross: Math.round(d.Cross), Churn: Math.round(d.Churn), Net: Math.round(d.New + d.Upsell + d.Cross + d.Churn) }));
    evolutionData.forEach((evo, index) => {
        const vari = variationData.find(v => v.ts === evo.timestamp) || { New: 0, Upsell: 0, Cross: 0, Churn: 0, Net: 0 };
        const beginningMRR = index > 0 ? evolutionData[index - 1].TotalMRR : 0; const endingMRR = evo.TotalMRR; const netGrowth = endingMRR - beginningMRR; const growthPercent = beginningMRR !== 0 ? (netGrowth / beginningMRR) * 100 : 0;
        const prevYearIndex = index - 12; let yyGrowth = 0; if (prevYearIndex >= 0) { const prevYearMRR = evolutionData[prevYearIndex].TotalMRR; yyGrowth = prevYearMRR !== 0 ? ((endingMRR - prevYearMRR) / prevYearMRR) * 100 : 0; }
        const churnRate = beginningMRR !== 0 ? (Math.abs(vari.Churn) / beginningMRR) * 100 : 0;
        financialTable.push({ date: evo.date, timestamp: evo.timestamp, beginning: beginningMRR, churn: vari.Churn, upsell: vari.Upsell, newSales: vari.New, crossSell: vari.Cross, ending: endingMRR, growthAmt: netGrowth, growthPct: growthPercent, yyGrowth: yyGrowth, churnRate: churnRate });
    });
    const currentMonthTs = new Date().getTime(); const currentTargetRate = getHistoricalRate(displayCurrency, currentMonthTs);
    Object.values(matrixDataMap).forEach(client => { const lastTs = matrixHeaders.length > 0 ? matrixHeaders[matrixHeaders.length - 1].timestamp : 0; client.total = client.history[lastTs] || 0; });
    const matrixRows = Object.values(matrixDataMap).sort((a, b) => b.total - a.total);
    contracts.forEach(c => {
      totalContracts++; const isChurn = c.status.toLowerCase().includes('churn') || c.status.toLowerCase().includes('end'); const sourceToCadRate = getHistoricalRate(c.currency, currentMonthTs); const mrrConvertedNow = (c.mrr * sourceToCadRate) / currentTargetRate;
      if (!aePerformance[c.ae]) { aePerformance[c.ae] = { name: c.ae, mrr: 0, contracts: 0 }; }
      if (isChurn) { churnCount++; let churnRateDate = currentMonthTs; if(c.end) { const d = new Date(c.end); d.setDate(1); churnRateDate = d.getTime(); } const churnSourceRate = getHistoricalRate(c.currency, churnRateDate); const churnTargetRate = getHistoricalRate(displayCurrency, churnRateDate); const mrrLost = (c.mrr * churnSourceRate) / churnTargetRate; totalLostMRR += mrrLost; churnByCSM[c.csm] = (churnByCSM[c.csm] || 0) + mrrLost; churnByAE[c.ae] = (churnByAE[c.ae] || 0) + mrrLost; if (c.end) { churnTimeline[churnRateDate] = (churnTimeline[churnRateDate] || 0) + mrrLost; } churnList.push({ ...c, mrrDisplay: mrrLost }); } else { totalMRR += mrrConvertedNow; if (c.clientId) activeClientIDs.add(c.clientId); const clientKey = c.clientId || c.clientName; if (!clientAggregates[clientKey]) { clientAggregates[clientKey] = { name: c.clientName, mrr: 0, count: 0 }; } clientAggregates[clientKey].mrr += mrrConvertedNow; clientAggregates[clientKey].count += 1; aePerformance[c.ae].mrr += mrrConvertedNow; aePerformance[c.ae].contracts += 1; if (mrrByCSM[c.csm]) mrrByCSM[c.csm] += mrrConvertedNow; else mrrByCSM[c.csm] = mrrConvertedNow; }
    });
    const top10Clients = Object.values(clientAggregates).sort((a, b) => b.mrr - a.mrr).slice(0, 10);
    const activeClients = activeClientIDs.size; const churnRate = totalContracts > 0 ? ((churnCount / totalContracts) * 100).toFixed(1) : 0;
    const csmChartData = Object.keys(mrrByCSM).map(key => ({ name: key, mrr: mrrByCSM[key] })).sort((a, b) => b.mrr - a.mrr);
    const aeChartData = Object.values(aePerformance).sort((a, b) => b.mrr - a.mrr).filter(ae => ae.name !== 'Non assigné' && ae.mrr > 0);
    const churnTimelineData = Object.keys(churnTimeline).map(ts => ({ date: new Date(parseInt(ts)).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }), timestamp: parseInt(ts), mrr: churnTimeline[ts] })).sort((a, b) => a.timestamp - b.timestamp);
    const churnByCSMData = Object.keys(churnByCSM).map(key => ({ name: key, value: churnByCSM[key] })).sort((a, b) => b.value - a.value);
    const churnByAEData = Object.keys(churnByAE).map(key => ({ name: key, value: churnByAE[key] })).sort((a, b) => b.value - a.value);
    return { totalMRR, activeClients, churnRate, totalContracts, csmChartData, aeChartData, evolutionData, variationData, matrixHeaders, matrixRows, totalLostMRR, churnCount, churnTimelineData, churnByCSMData, churnByAEData, churnList, top10Clients, financialTable };
  }, [rawData, displayCurrency]); 

  const exportMatrixToExcel = () => {
    if (!window.XLSX) return;
    const rowsToExport = kpis.matrixRows.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const headers = ['Client', ...kpis.matrixHeaders.map(h => h.label)];
    const data = rowsToExport.map(row => {
      const rowData = [row.name];
      kpis.matrixHeaders.forEach(header => { const val = row.history[header.timestamp] || 0; rowData.push(val); });
      return rowData;
    });
    const ws = window.XLSX.utils.aoa_to_sheet([headers, ...data]);
    const symbol = getCurrencySymbol(displayCurrency); const currencyFormat = `"${symbol}"#,##0`; const range = window.XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { for (let C = range.s.c + 1; C <= range.e.c; ++C) { const cell_address = { c: C, r: R }; const cell_ref = window.XLSX.utils.encode_cell(cell_address); if (ws[cell_ref]) { ws[cell_ref].z = currencyFormat; } } }
    const wb = window.XLSX.utils.book_new(); window.XLSX.utils.book_append_sheet(wb, ws, "Matrice MRR"); window.XLSX.writeFile(wb, `Tervene_Matrice_MRR_${displayCurrency}.xlsx`);
  };

  const exportContractsToExcel = () => {
    if (!window.XLSX) return;
    
    // Préparer les en-têtes
    const headers = [
      'Client',
      'Client ID',
      '# Contrat',
      'Contrat ID',
      'Commentaire',
      'A/E',
      'CSM',
      'Partenaire',
      'Start Status',
      'Date Signature',
      'Date Début',
      'Type Vente',
      'Augmentation %',
      'Date Augmentation',
      'End Status',
      'Date Fin',
      'Pays',
      'Devise',
      '# Licences',
      'Prix Licence',
      'MRR'
    ];
    
    // Préparer les données (utiliser filteredData pour respecter la recherche)
    const data = filteredData.map(row => [
      row['Nom'] || '',
      row['# client ID'] || '',
      row['# contract'] || '',
      row['# contract ID'] || '',
      row['Commentaire'] || '',
      row['A/E'] || '',
      row['CSM'] || '',
      row['Partenaire'] || '',
      row['Start Status'] || '',
      row['Signed Date'] || '',
      row['Start Date'] || '',
      row['Up sell (U) or new client (N) or cross-sell (C)'] || '',
      row['Aug. / y (%)'] || '',
      row['date augmentation'] || '',
      row['End Status'] || '',
      row['End date'] || '',
      row['Pays'] || '',
      row['Devise'] || '',
      row['# License'] || '',
      row['License Price'] || '',
      row['mrr_calc'] || 0
    ]);
    
    // Créer la feuille Excel
    const ws = window.XLSX.utils.aoa_to_sheet([headers, ...data]);
    
    // Appliquer le formatage monétaire à la colonne MRR (dernière colonne)
    const range = window.XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      // Colonne MRR (dernière colonne, index 20)
      const cell_address = { c: 20, r: R };
      const cell_ref = window.XLSX.utils.encode_cell(cell_address);
      if (ws[cell_ref]) {
        ws[cell_ref].z = '#,##0.00';
        ws[cell_ref].t = 'n';
      }
    }
    
    // Définir la largeur des colonnes
    ws['!cols'] = [
      { wch: 30 }, // Client
      { wch: 10 }, // Client ID
      { wch: 10 }, // # Contrat
      { wch: 12 }, // Contrat ID
      { wch: 30 }, // Commentaire
      { wch: 20 }, // A/E
      { wch: 20 }, // CSM
      { wch: 20 }, // Partenaire
      { wch: 12 }, // Start Status
      { wch: 12 }, // Date Signature
      { wch: 12 }, // Date Début
      { wch: 12 }, // Type Vente
      { wch: 12 }, // Augmentation %
      { wch: 15 }, // Date Augmentation
      { wch: 12 }, // End Status
      { wch: 12 }, // Date Fin
      { wch: 12 }, // Pays
      { wch: 10 }, // Devise
      { wch: 10 }, // # Licences
      { wch: 12 }, // Prix Licence
      { wch: 15 }  // MRR
    ];
    
    // Créer le classeur et télécharger
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Contrats");
    const today = new Date().toISOString().split('T')[0];
    window.XLSX.writeFile(wb, `Tervene_Contrats_${today}.xlsx`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      if (!window.XLSX) { alert("Librairie Excel non chargée."); return; }
      reader.onload = (evt) => {
        const data = evt.target.result; const workbook = window.XLSX.read(data, { type: 'binary' }); const wsname = workbook.SheetNames[0]; const ws = workbook.Sheets[wsname]; const jsonData = window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
        const processedData = processRawRows(jsonData);
        updateAndSaveData(processedData); setIsFileUploaded(true); setShowImportModal(false); setShowToast(true); setTimeout(() => setShowToast(false), 3000);
        const partners = new Set(config.partners); const aes = new Set(config.aes); const csms = new Set(config.csms);
        jsonData.forEach(row => { if (row['Partenaire']) partners.add(row['Partenaire']); if (row['A/E']) aes.add(row['A/E']); if (row['CSM']) csms.add(row['CSM']); });
        const newConfig = { ...config, partners: Array.from(partners).sort(), aes: Array.from(aes).sort(), csms: Array.from(csms).sort() };
        updateAndSaveConfig(newConfig);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.onload = (evt) => { 
        const parsedData = parseCSV(evt.target.result);
        updateAndSaveData(parsedData); setIsFileUploaded(true); setShowImportModal(false); setShowToast(true); setTimeout(() => setShowToast(false), 3000); 
      };
      reader.readAsText(file);
    }
  };

  const COLUMNS = [
    { key: 'Nom', label: 'Client', width: 'min-w-[250px]' },
    { key: '# client ID', label: 'Client ID', width: 'min-w-[100px]' },
    { key: '# contract', label: '# Contrat', width: 'min-w-[100px]' },
    { key: '# contract ID', label: 'Contrat ID', width: 'min-w-[120px]' },
    { key: 'Commentaire', label: 'Commentaire', width: 'min-w-[200px]' },
    { key: 'A/E', label: 'A/E', width: 'min-w-[150px]' },
    { key: 'CSM', label: 'CSM', width: 'min-w-[150px]' },
    { key: 'Partenaire', label: 'Partenaire', width: 'min-w-[150px]' },
    { key: 'Start Status', label: 'Start Status', width: 'min-w-[120px]' },
    { key: 'Signed Date', label: 'Date Sign.', width: 'min-w-[120px]' },
    { key: 'Start Date', label: 'Date Début', width: 'min-w-[120px]' },
    { key: 'Up sell (U) or new client (N) or cross-sell (C)', label: 'Type', width: 'min-w-[100px]' },
    { key: 'Aug. / y (%)', label: 'Aug %', width: 'min-w-[100px]' },
    { key: 'date augmentation', label: 'Date Aug.', width: 'min-w-[120px]' },
    { key: 'End Status', label: 'End Status', width: 'min-w-[120px]' },
    { key: 'End date', label: 'Date Fin', width: 'min-w-[120px]' },
    { key: 'Pays', label: 'Pays', width: 'min-w-[100px]' },
    { key: 'Devise', label: 'Devise', width: 'min-w-[80px]' },
    { key: 'mrr_calc', label: 'MRR (Origine)', width: 'min-w-[120px]', isMoney: true },
  ];

  const currencySymbol = getCurrencySymbol(displayCurrency);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* DRILL DOWN MODAL */}
      {drillDownData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden my-8">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg text-gray-800">Détail de la Variation - {drillDownData.month}</h3>
               <button onClick={() => setDrillDownData(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>
             <div className="p-0 overflow-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                   <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CSM</th>
                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Impact MRR ({displayCurrency})</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                      {drillDownData.contracts.sort((a, b) => Math.abs(b.displayAmount) - Math.abs(a.displayAmount)).map((c, i) => (
                         <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isChurn ? 'bg-red-100 text-red-700' : c.displayType === 'Nouveau' ? 'bg-blue-100 text-blue-700' : c.displayType === 'Upsell' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                  {c.displayType}
                                </span>
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-900">{c.Nom}</td>
                            <td className="px-4 py-2 text-gray-500">{c.CSM}</td>
                            <td className={`px-4 py-2 text-right font-bold ${c.displayAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                               {c.displayAmount >= 0 ? '+' : ''}{currencySymbol}{Math.round(c.displayAmount).toLocaleString()}
                            </td>
                         </tr>
                      ))}
                      {drillDownData.contracts.length === 0 && (
                         <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucune variation majeure ce mois-ci.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle size={24} />
          <div>
            <h4 className="font-bold">Succès !</h4>
            <p className="text-sm text-green-100">Opération effectuée avec succès.</p>
          </div>
        </div>
      )}

      {/* MODAL IMPORT */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Importer des Données</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 text-center">
               <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mettre à jour les données</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Importez votre fichier CSV ou Excel ("Licences Tervene.xlsx" ou "test 1.xlsx"). Les données seront traitées localement.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-gray-500">
                  <p className="font-medium text-gray-900 mb-1">Cliquez pour importer ou glissez le fichier ici</p>
                  <p className="text-xs">Supporte format .CSV et .XLSX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL AJOUT/EDIT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">{editingIndex !== null ? 'Modifier Contrat' : 'Nouveau Contrat'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveContract} className="p-6 grid grid-cols-2 gap-6">
              
              {/* SELECTEUR DE MODE (Caché si édition) */}
              {editingIndex === null && (
                <div className="col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-4 justify-center">
                  <button 
                      type="button"
                      onClick={() => toggleClientMode(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isNewClientMode ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-100'}`}
                  >
                      <UserPlus size={18} /> Nouveau Client
                  </button>
                  <button 
                      type="button"
                      onClick={() => toggleClientMode(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${!isNewClientMode ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-100'}`}
                  >
                      <User size={18} /> Client Existant
                  </button>
                </div>
              )}

              {/* Section 1: Info Client */}
              <div className="col-span-2 space-y-4 border-b border-gray-100 pb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Briefcase size={16}/> Infos Client
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isNewClientMode ? "Nom du Nouveau Client" : "Sélectionner le Client"}
                        </label>
                        
                        {isNewClientMode ? (
                             <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                             value={newContract.Nom} onChange={e => setNewContract({...newContract, Nom: e.target.value})} placeholder="Ex: Acme Corp" />
                        ) : (
                             <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={handleClientSelect}
                                value={newContract['# client ID']}
                                disabled={editingIndex !== null} 
                             >
                                <option value="" disabled>-- Choisir un client --</option>
                                {uniqueClients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                             </select>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID (Auto)</label>
                        <div className="relative">
                            <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="text" readOnly className="w-full pl-9 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                            value={newContract['# client ID']} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contrat #</label>
                            <input type="text" readOnly className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                            value={newContract['# contract']} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contrat ID</label>
                            <input type="text" readOnly className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                            value={newContract['# contract ID']} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newContract.Pays} onChange={e => setNewContract({...newContract, Pays: e.target.value})} placeholder="Ex: Canada" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Partenaire</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={newContract.Partenaire} onChange={e => setNewContract({...newContract, Partenaire: e.target.value})}>
                            <option value="">- Aucun -</option>
                            {config.partners.map((p, i) => <option key={i} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" rows="2"
                        value={newContract.Commentaire} onChange={e => setNewContract({...newContract, Commentaire: e.target.value})}></textarea>
                    </div>
                </div>
              </div>

              {/* Section 2: Dates & Statuts */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Calendar size={16}/> Dates & Statuts
                </h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Signed Date</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newContract['Signed Date']} onChange={e => setNewContract({...newContract, 'Signed Date': e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Start Status</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newContract['Start Status']} onChange={e => setNewContract({...newContract, 'Start Status': e.target.value})}>
                                {config.startStatuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Début facturation)</label>
                        <input type="date" required className="w-full px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg text-sm font-medium"
                        value={newContract['Start Date']} onChange={e => setNewContract({...newContract, 'Start Date': e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newContract['End date']} onChange={e => setNewContract({...newContract, 'End date': e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">End Status</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={newContract['End Status']} onChange={e => setNewContract({...newContract, 'End Status': e.target.value})}>
                                <option value="">-</option>
                                {config.endStatuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-gray-500 mb-1">Date Augmentation</label>
                         <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                         value={newContract['date augmentation']} onChange={e => setNewContract({...newContract, 'date augmentation': e.target.value})} />
                    </div>
                </div>
              </div>

              {/* Section 3: Financier */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <DollarSign size={16}/> Financier
                </h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">MRR (Mensuel)</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-lg text-lg font-bold text-green-700"
                                value={newContract.mrr_calc} 
                                onChange={e => setNewContract({...newContract, mrr_calc: e.target.value === '' ? 0 : parseFloat(e.target.value)})} 
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">Devise</label>
                             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             value={newContract.Devise} onChange={e => setNewContract({...newContract, Devise: e.target.value})}>
                                {config.currencies.map((c, i) => <option key={i} value={c}>{c}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">Type Vente</label>
                             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             value={newContract.type} onChange={e => setNewContract({...newContract, type: e.target.value})}>
                                {config.salesTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1"># Licences</label>
                             <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             value={newContract['# License']} onChange={e => setNewContract({...newContract, '# License': e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Prix Licence</label>
                             <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             value={newContract['License Price']} onChange={e => setNewContract({...newContract, 'License Price': e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Augmentation %</label>
                             <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             value={newContract['Aug. / y (%)']} onChange={e => setNewContract({...newContract, 'Aug. / y (%)': e.target.value})} />
                        </div>
                    </div>
                </div>
              </div>

              {/* Section 4: Équipe */}
              <div className="col-span-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-6">
                 <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Executive (A/E)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={newContract['A/E']} onChange={e => setNewContract({...newContract, 'A/E': e.target.value})}>
                          <option value="">- Sélectionner -</option>
                          {config.aes.map((a, i) => <option key={i} value={a}>{a}</option>)}
                      </select>
                 </div>
                 <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Success Manager (CSM)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={newContract.CSM} onChange={e => setNewContract({...newContract, CSM: e.target.value})}>
                          <option value="">- Sélectionner -</option>
                          {config.csms.map((c, i) => <option key={i} value={c}>{c}</option>)}
                      </select>
                 </div>
              </div>

              <div className="col-span-2 pt-4 flex gap-3 justify-end border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">
                  {editingIndex !== null ? 'Mettre à jour' : 'Créer le Contrat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
                <h1 className="text-xl font-bold flex items-center gap-2 whitespace-nowrap">
                    <img src="/favicon.svg" alt="Tervene Logo" className="w-8 h-8 flex-shrink-0" />
                    Tervene
                </h1>
                <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">Analytics v8.6</p>
            </div>
          )}
          {isSidebarCollapsed && <img src="/favicon.svg" alt="Tervene" className="w-8 h-8 flex-shrink-0 mx-auto" />}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-2 mt-4 overflow-y-auto">
          {!isSidebarCollapsed && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">DATA</div>}
          {isSidebarCollapsed && <div className="h-px bg-slate-800 my-4 mx-2"></div>}
          
          <button onClick={() => setActiveTab('licences')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'licences' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Contrat client"><FileSpreadsheet size={20} /> {!isSidebarCollapsed && <span>Contrat client</span>}</button>

          {!isSidebarCollapsed && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">DASHBOARDS</div>}
          {isSidebarCollapsed && <div className="h-px bg-slate-800 my-4 mx-2"></div>}
          
          <button onClick={() => setActiveTab('mrr')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'mrr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Revenus"><DollarSign size={20} /> {!isSidebarCollapsed && <span>Revenus</span>}</button>
          <button onClick={() => setActiveTab('growth')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'growth' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Croissance"><TrendingUp size={20} /> {!isSidebarCollapsed && <span>Croissance</span>}</button>
          <button onClick={() => setActiveTab('churn')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'churn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Analyse Churn"><UserX size={20} /> {!isSidebarCollapsed && <span>Analyse Churn</span>}</button>
          <button onClick={() => setActiveTab('performance')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'performance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Performance A/E"><Award size={20} /> {!isSidebarCollapsed && <span>Perf. A/E</span>}</button>
          <button onClick={() => setActiveTab('client_mrr')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'client_mrr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Matrice MRR"><TableIcon size={20} /> {!isSidebarCollapsed && <span>Matrice Client</span>}</button>
          
          {!isSidebarCollapsed && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">PARAMÈTRES</div>}
          {isSidebarCollapsed && <div className="h-px bg-slate-800 my-4 mx-2"></div>}
          
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'} ${isSidebarCollapsed ? 'justify-center' : ''}`} title="Configuration"><Settings size={20} /> {!isSidebarCollapsed && <span>Configuration</span>}</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-3">
          <div className="w-full mx-auto">
            
            {/* Header Logic */}
            {activeTab === 'config' ? (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
                        <p className="text-gray-500">Paramètres du système.</p>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button 
                          onClick={() => setConfigSubTab('general')} 
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${configSubTab === 'general' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Listes Déroulantes
                        </button>
                        <button 
                          onClick={() => setConfigSubTab('rates')} 
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${configSubTab === 'rates' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Grille des Taux
                        </button>
                    </div>
                 </div>

                 {configSubTab === 'general' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-0 overflow-hidden">
                            <div className="bg-blue-50 p-3 border-b border-blue-100 font-bold text-blue-800">Équipes</div>
                            <div className="p-4 space-y-4">
                                <div className="h-64"><ConfigList title="Account Executives (A/E)" items={config.aes} onAdd={(i) => addToConfig('aes', i)} onDelete={(i) => removeFromConfig('aes', i)} placeholder="Ajouter un vendeur..." /></div>
                                <div className="h-64"><ConfigList title="Customer Success (CSM)" items={config.csms} onAdd={(i) => addToConfig('csms', i)} onDelete={(i) => removeFromConfig('csms', i)} placeholder="Ajouter un CSM..." /></div>
                            </div>
                        </Card>
                        <Card className="p-0 overflow-hidden">
                            <div className="bg-green-50 p-3 border-b border-green-100 font-bold text-green-800">Contrats</div>
                             <div className="p-4 space-y-4">
                                <div className="h-40"><ConfigList title="Types de Vente" items={config.salesTypes} onAdd={(i) => addToConfig('salesTypes', i)} onDelete={(i) => removeFromConfig('salesTypes', i)} /></div>
                                <div className="h-40"><ConfigList title="Devises" items={config.currencies} onAdd={(i) => addToConfig('currencies', i)} onDelete={(i) => removeFromConfig('currencies', i)} /></div>
                                <div className="h-40"><ConfigList title="Partenaires" items={config.partners} onAdd={(i) => addToConfig('partners', i)} onDelete={(i) => removeFromConfig('partners', i)} placeholder="Ajouter partenaire..." /></div>
                            </div>
                        </Card>
                        <Card className="p-0 overflow-hidden">
                            <div className="bg-orange-50 p-3 border-b border-orange-100 font-bold text-orange-800">Statuts</div>
                             <div className="p-4 space-y-4">
                                <div className="h-64"><ConfigList title="Statuts de Début" items={config.startStatuses} onAdd={(i) => addToConfig('startStatuses', i)} onDelete={(i) => removeFromConfig('startStatuses', i)} /></div>
                                <div className="h-64"><ConfigList title="Statuts de Fin" items={config.endStatuses} onAdd={(i) => addToConfig('endStatuses', i)} onDelete={(i) => removeFromConfig('endStatuses', i)} /></div>
                            </div>
                        </Card>
                     </div>
                 ) : (
                    <Card className="p-0 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
                       <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                          <div className="font-bold text-gray-800 flex items-center gap-2"><RefreshCw size={18}/> Historique des Taux de Change (Simulé)</div>
                          <div className="text-xs text-gray-500">Taux utilisés pour la conversion en CAD</div>
                       </div>
                       <div className="flex-1 overflow-auto p-0">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">1 USD &#8594; CAD</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">1 EUR &#8594; CAD</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {kpis.matrixHeaders.map((header, idx) => (
                                <tr key={idx} className="hover:bg-blue-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{header.label}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">{getHistoricalRate('USD', header.timestamp).toFixed(4)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">{getHistoricalRate('EUR', header.timestamp).toFixed(4)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                       </div>
                    </Card>
                 )}
              </div>
            ) : (
               <>
               {/* CONTENU PRINCIPAL (Dashboards & Listes) */}
               <div className="flex justify-between items-end mb-4">
                  <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeTab === 'mrr' && "Analyse Financière (MRR)"}
                        {activeTab === 'growth' && "Indicateurs de Croissance"}
                        {activeTab === 'churn' && "Analyse du Churn (Attrition)"}
                        {activeTab === 'performance' && "Performance des Ventes (A/E)"}
                        {activeTab === 'client_mrr' && "Matrice MRR par Client"}
                        {activeTab === 'licences' && "Contrat client"}
                        {activeTab === 'import' && "Importation"}
                      </h2>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                        <div className="px-2 text-gray-400"><Globe size={16}/></div>
                        <select className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer" value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)}>
                          {config.currencies.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                      </div>
                      {!isFileUploaded && (
                          <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                            <AlertCircle size={14} /> Mode Démo
                          </div>
                      )}
                  </div>
                </div>

                {/* ... (Dashboard MRR) ... */}
                {activeTab === 'mrr' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard title={`MRR Total (${displayCurrency})`} value={`${currencySymbol}${kpis.totalMRR.toLocaleString(undefined, {maximumFractionDigits: 0})}`} subtext="Revenu mensuel courant" icon={DollarSign} trend={2.5} />
                      <MetricCard title="Churn Rate" value={`${kpis.churnRate}%`} subtext="Basé sur contrats fermés" icon={TrendingDown} trend={-0.4} />
                      <MetricCard title={`ARPU (${displayCurrency})`} value={`${currencySymbol}${kpis.activeClients ? (kpis.totalMRR / kpis.activeClients).toFixed(0) : 0}`} subtext="Revenu moyen / client" icon={CreditCard} />
                      <MetricCard title={`Pipeline Est. (${displayCurrency})`} value={`${currencySymbol}${(kpis.totalMRR * 12).toLocaleString(undefined, {maximumFractionDigits: 0})}`} subtext="ARR Extrapolé" icon={BarChart2} colorClass="text-purple-600 bg-purple-50" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* GRAPHIQUE 1: COMPOSITION */}
                      <Card className="p-4 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={18} className="text-green-500"/> Composition du MRR Actif ({displayCurrency})
                          </h3>
                          <div className="flex gap-4 text-xs font-medium">
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#3B82F6] rounded-sm"></span> Nouveau</span>
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#10B981] rounded-sm"></span> Upsell</span>
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#8B5CF6] rounded-sm"></span> Cross-sell</span>
                             <span className="flex items-center gap-1 ml-2"><span className="w-3 h-3 bg-[#111827] rounded-full"></span> Total</span>
                          </div>
                        </div>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={kpis.evolutionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{fontSize: 12}} />
                              <YAxis tick={{fontSize: 12}} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} />
                              <Tooltip formatter={(val, name) => [`${currencySymbol}${val.toLocaleString()}`, name]} />
                              <Legend />
                              <Bar dataKey="Nouveau" stackId="a" fill="#3B82F6" name="Nouveau" />
                              <Bar dataKey="Upsell" stackId="a" fill="#10B981" name="Upsell" />
                              <Bar dataKey="Cross-sell" stackId="a" fill="#8B5CF6" name="Cross-sell" />
                              <Line type="monotone" dataKey="TotalMRR" stroke="#111827" strokeWidth={2} dot={false} name="Total" />
                              <Brush dataKey="date" height={30} stroke="#3B82F6" startIndex={Math.max(0, kpis.evolutionData.length - 12)} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>

                      {/* GRAPHIQUE 2: VARIATION */}
                      <Card className="p-4 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Activity size={18} className="text-orange-500"/> Variation Mensuelle ({displayCurrency})
                          </h3>
                          <div className="flex gap-4 text-xs font-medium">
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#3B82F6] rounded-sm"></span> Nouveau</span>
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#10B981] rounded-sm"></span> Upsell</span>
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#8B5CF6] rounded-sm"></span> Cross-sell</span>
                             <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#EF4444] rounded-sm"></span> Churn</span>
                             <span className="flex items-center gap-1 ml-2"><span className="w-3 h-3 bg-[#111827] rounded-full"></span> Net</span>
                          </div>
                        </div>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={kpis.variationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{fontSize: 12}} />
                              <YAxis tick={{fontSize: 12}} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} />
                              <Tooltip formatter={(val, name) => [`${currencySymbol}${val.toLocaleString()}`, name]} />
                              <ReferenceLine y={0} stroke="#000" />
                              <Legend onClick={handleVariationChartClick} wrapperStyle={{cursor: 'pointer'}} />
                              <Bar dataKey="New" stackId="b" fill="#3B82F6" name="Nouveau" onClick={handleVariationChartClick} cursor="pointer" />
                              <Bar dataKey="Upsell" stackId="b" fill="#10B981" name="Upsell" onClick={handleVariationChartClick} cursor="pointer" />
                              <Bar dataKey="Cross" stackId="b" fill="#8B5CF6" name="Cross-sell" onClick={handleVariationChartClick} cursor="pointer" />
                              <Bar dataKey="Churn" stackId="b" fill="#EF4444" name="Churn" onClick={handleVariationChartClick} cursor="pointer" />
                              <Line type="monotone" dataKey="Net" stroke="#111827" strokeWidth={2} dot={false} name="Net" />
                              <Brush dataKey="date" height={30} stroke="#F97316" startIndex={Math.max(0, kpis.variationData.length - 12)} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>
                    
                    {/* TABLEAU FINANCIER DÉTAILLÉ */}
                    <Card className="p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <TableIcon size={18} className="text-gray-500"/> Tableau Financier Mensuel ({displayCurrency})
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm border-separate border-spacing-0">
                          <thead className="bg-gray-50 sticky top-0 z-20">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-r z-30 min-w-[200px]">Métrique</th>
                              {kpis.financialTable.map((col, idx) => (
                                <th key={idx} className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-b">{col.date}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white border-r z-10">$ at beginning of period</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-gray-600">{Math.round(col.beginning).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-red-600 sticky left-0 bg-white border-r z-10">Contraction (Churn)</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-red-600">{Math.round(col.churn).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-green-600 sticky left-0 bg-white border-r z-10">($) Upsell</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-green-600">{Math.round(col.upsell).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-blue-600 sticky left-0 bg-white border-r z-10">($) New sales</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-blue-600">{Math.round(col.newSales).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50 border-b-2 border-gray-100">
                              <td className="px-4 py-3 font-medium text-purple-600 sticky left-0 bg-white border-r z-10">($) Cross sell</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-purple-600">{Math.round(col.crossSell).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50 bg-gray-50 font-bold">
                              <td className="px-4 py-3 text-gray-900 sticky left-0 bg-gray-50 border-r z-10">$ at end of period</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-gray-900">{Math.round(col.ending).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white border-r z-10">Monthly Grow ($)</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className={`px-4 py-3 text-right ${col.growthAmt >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(col.growthAmt).toLocaleString()}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white border-r z-10">Monthly Grow (%)</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className={`px-4 py-3 text-right ${col.growthPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{col.growthPct.toFixed(1)}%</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white border-r z-10">Y/Y Grow (%)</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className={`px-4 py-3 text-right ${col.yyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{col.yyGrowth ? col.yyGrowth.toFixed(1) + '%' : '-'}</td>)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white border-r z-10">Monthly Churn Rate (%)</td>
                              {kpis.financialTable.map((col, idx) => <td key={idx} className="px-4 py-3 text-right text-red-600">{col.churnRate.toFixed(2)}%</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {/* --- ONGLET 2: CROISSANCE --- */}
                {activeTab === 'growth' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <MetricCard title="Clients Actifs" value={kpis.activeClients} subtext="Clients uniques payants" icon={Users} colorClass="text-indigo-600 bg-indigo-50" />
                      <MetricCard title="Contrats Actifs" value={kpis.evolutionData.length > 0 ? kpis.evolutionData[kpis.evolutionData.length - 1].ActiveContracts : 0} subtext="Licences distinctes actives" icon={FileSpreadsheet} colorClass="text-orange-600 bg-orange-50" />
                      <MetricCard title="Contrats Total (Vie)" value={kpis.totalContracts} subtext="Inclus churn & historique" icon={Briefcase} colorClass="text-gray-600 bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       <Card className="p-4 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                          <Users size={18} className="text-indigo-500"/> Évolution du nombre de Clients Actifs
                        </h3>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpis.evolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} />
                              <YAxis domain={['auto', 'auto']} />
                              <Tooltip />
                              <Line type="monotone" dataKey="ActiveClients" stroke="#4F46E5" strokeWidth={3} dot={false} name="Clients Actifs" />
                              <Brush dataKey="date" height={30} stroke="#4F46E5" startIndex={Math.max(0, kpis.evolutionData.length - 12)} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'churn' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard title={`MRR Perdu Total (${displayCurrency})`} value={`${currencySymbol}${kpis.totalLostMRR.toLocaleString(undefined, {maximumFractionDigits: 0})}`} subtext="Cumul historique" icon={TrendingDown} colorClass="text-red-600 bg-red-50" />
                      <MetricCard title="Clients Perdus" value={kpis.churnCount} subtext="Contrats marqués Churn/End" icon={UserX} colorClass="text-red-600 bg-red-50" />
                      <MetricCard title={`Perte Moyenne (${displayCurrency})`} value={`${currencySymbol}${kpis.churnCount > 0 ? (kpis.totalLostMRR / kpis.churnCount).toFixed(0) : 0}`} subtext="MRR moyen par départ" icon={AlertTriangle} colorClass="text-orange-600 bg-orange-50" />
                    </div>
                    <Card className="p-4 h-[400px] flex flex-col">
                      <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                        <Calendar size={18} className="text-red-500"/> Historique des Pertes (MRR par mois de fin)
                      </h3>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={kpis.churnTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} tickFormatter={(val) => `${currencySymbol}${val}`} />
                            <Tooltip formatter={(val) => [`${currencySymbol}${val.toLocaleString()}`, 'MRR Perdu']} />
                            <Bar dataKey="mrr" fill="#EF4444" name="MRR Perdu" radius={[4, 4, 0, 0]} />
                            <Brush dataKey="date" height={30} stroke="#EF4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card className="p-4 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">MRR Perdu par CSM ({displayCurrency})</h3>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={kpis.churnByCSMData.slice(0, 10)} layout="vertical" margin={{ left: 40, right: 30, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis type="number" hide />
                              <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 12}} />
                              <Tooltip formatter={(val) => `${currencySymbol}${val.toLocaleString()}`} />
                              <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                      <Card className="p-4 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">MRR Perdu par A/E ({displayCurrency})</h3>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={kpis.churnByAEData.slice(0, 10)} layout="vertical" margin={{ left: 40, right: 30, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis type="number" hide />
                              <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 12}} />
                              <Tooltip formatter={(val) => `${currencySymbol}${val.toLocaleString()}`} />
                              <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>
                    <Card className="p-4 flex flex-col h-[400px]">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">Derniers Clients Perdus</h3>
                      <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Fin</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CSM</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">MRR Perdu</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {kpis.churnList.sort((a, b) => b.mrrDisplay - a.mrrDisplay).slice(0, 50).map((c, idx) => (
                                <tr key={idx} className="hover:bg-red-50">
                                  <td className="px-4 py-2 font-medium text-gray-900">{c.clientName}</td>
                                  <td className="px-4 py-2 text-gray-500">{c['End date'] || '-'}</td>
                                  <td className="px-4 py-2 text-gray-500">{c.csm}</td>
                                  <td className="px-4 py-2 text-right font-bold text-red-600">-{currencySymbol}{c.mrrDisplay ? c.mrrDisplay.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {kpis.aeChartData.slice(0, 3).map((ae, idx) => (
                          <Card key={idx} className="p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Award size={64} className="text-yellow-500" />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                 ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                   idx === 1 ? 'bg-gray-100 text-gray-700' : 
                                   'bg-orange-100 text-orange-700'}`}>
                                 {idx + 1}
                               </div>
                               <h3 className="font-bold text-gray-800 text-lg">{ae.name}</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-gray-500">MRR Signé</span>
                                 <span className="font-bold text-gray-900">{currencySymbol}{ae.mrr.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(ae.mrr / kpis.aeChartData[0].mrr) * 100}%` }}></div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                 <span className="text-sm text-gray-500">Contrats</span>
                                 <span className="font-bold text-gray-900">{ae.contracts}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="p-4 h-[500px] flex flex-col">
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Classement par MRR Généré ({displayCurrency})</h3>
                          <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={kpis.aeChartData} layout="vertical" margin={{ left: 40, right: 30, top: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 12, fontWeight: '500'}} />
                                <Tooltip formatter={(val) => `${currencySymbol}${val.toLocaleString()}`} cursor={{fill: 'transparent'}} />
                                <Bar dataKey="mrr" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} name="MRR Total">
                                   {kpis.aeChartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={index < 3 ? '#2563EB' : '#93C5FD'} />
                                   ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                        <Card className="p-4 h-[500px] flex flex-col">
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Classement par Volume de Contrats</h3>
                          <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[...kpis.aeChartData].sort((a,b) => b.contracts - a.contracts)} layout="vertical" margin={{ left: 40, right: 30, top: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 12, fontWeight: '500'}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="contracts" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} name="Nombre de contrats">
                                   {kpis.aeChartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={'#8B5CF6'} />
                                   ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                     </div>
                  </div>
                )}

                {activeTab === 'client_mrr' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Rechercher un client..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-64 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                      <button onClick={exportMatrixToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">
                        <Download size={20} /> Exporter vers Excel
                      </button>
                    </div>
                    <Card className="shadow-md flex flex-col h-[calc(100vh-180px)]"> 
                      <div className="flex-1 overflow-auto w-full"> 
                        <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                          <thead className="bg-gray-50 sticky top-0 z-20"> 
                            <tr>
                              {/* COLUMN HEADER RESIZABLE */}
                              <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 top-0 z-30 bg-gray-50 border-r border-b border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group relative select-none"
                                style={{ width: clientColumnWidth, minWidth: clientColumnWidth, maxWidth: clientColumnWidth }}
                              >
                                Client
                                <div onMouseDown={startResize} className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400 opacity-0 hover:opacity-100 transition-opacity z-40" />
                              </th>
                              {kpis.matrixHeaders.map((header, idx) => ( 
                                <th key={idx} className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] sticky top-0 z-20 bg-gray-50 border-b border-gray-200">{header.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {kpis.matrixRows.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase())).map((row, rowIdx) => (
                              <React.Fragment key={rowIdx}>
                              <tr className="hover:bg-blue-50 transition-colors group">
                                {/* COLUMN CELL RESIZABLE */}
                                <td 
                                  className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 z-10 bg-white border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-blue-50 overflow-hidden text-ellipsis cursor-pointer flex items-center gap-2"
                                  style={{ width: clientColumnWidth, minWidth: clientColumnWidth, maxWidth: clientColumnWidth }}
                                  title={row.name}
                                  onClick={() => toggleClientExpansion(row.id)}
                                >
                                  {expandedClientRows.has(row.id) ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                                  <span className="truncate">{row.name}</span>
                                </td>
                                {kpis.matrixHeaders.map((header, colIdx) => {
                                  const mrr = row.history[header.timestamp];
                                  return (
                                    <td key={colIdx} className={`px-3 py-4 whitespace-nowrap text-sm text-right ${mrr ? 'text-gray-900' : 'text-gray-300'}`}>
                                      {mrr ? `${currencySymbol}${Math.round(mrr).toLocaleString()}` : '-'}
                                    </td>
                                  );
                                })}
                              </tr>
                              
                              {/* Sous-lignes pour les contrats */}
                              {expandedClientRows.has(row.id) && Object.values(row.contracts).map((contract, cIdx) => (
                                 <tr key={`${rowIdx}-${cIdx}`} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td 
                                      className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 sticky left-0 z-10 bg-gray-50 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pl-10 flex items-center"
                                      style={{ width: clientColumnWidth, minWidth: clientColumnWidth, maxWidth: clientColumnWidth }}
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></div>
                                      <span className="truncate">{contract.name}</span>
                                    </td>
                                    {kpis.matrixHeaders.map((header, colIdx) => {
                                      const contractMrr = contract.history[header.timestamp];
                                      return (
                                        <td key={colIdx} className={`px-3 py-2 whitespace-nowrap text-xs text-right ${contractMrr ? 'text-gray-600 font-medium' : 'text-gray-300'}`}>
                                          {contractMrr ? `${currencySymbol}${Math.round(contractMrr).toLocaleString()}` : ''}
                                        </td>
                                      );
                                    })}
                                 </tr>
                              ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
                        Affichage complet de l'historique et de tous les clients.
                      </div>
                    </Card>
                  </div>
                )}

            {activeTab === 'licences' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800">Liste des Contrats</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" placeholder="Rechercher partout..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-64 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium">
                      <Upload size={20} /> Importer
                    </button>
                    <button onClick={exportContractsToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">
                      <Download size={20} /> Exporter Excel
                    </button>
                    <button onClick={() => { openAddModal() }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                      <Plus size={20} /> Nouveau Contrat
                    </button>
                  </div>
                </div>
                <Card className="overflow-hidden shadow-md flex flex-col h-[calc(100vh-180px)]">
                  <div className="overflow-auto w-full">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-20">
                          <tr>
                            {COLUMNS.map((col, idx) => (
                              <th key={idx} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${col.width}`} onClick={() => handleSort(col.key)}>
                                <div className="flex items-center gap-1">
                                  {col.label}
                                  {sortConfig.key === col.key && (<span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>)}
                                </div>
                              </th>
                            ))}
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-20 w-[100px]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.slice(0, 100).map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-blue-50 transition-colors">
                              {COLUMNS.map((col, colIdx) => {
                                let val = row[col.key];
                                if (col.key === 'mrr_calc') val = row.mrr_calc;
                                if (col.key === 'Start Status' || col.key === 'End Status') {
                                  const status = val || '';
                                  const isChurn = status.toLowerCase().includes('churn') || status.toLowerCase().includes('end');
                                  const isActive = status.toLowerCase().includes('active') || status.toLowerCase().includes('signed') || status.toLowerCase().includes('renew');
                                  return (
                                    <td key={colIdx} className="px-4 py-4 whitespace-nowrap text-sm">
                                      {val ? (<span className={`px-2 py-1 rounded-full text-xs font-semibold ${isChurn ? 'bg-red-100 text-red-700' : isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{val}</span>) : '-'}
                                    </td>
                                  );
                                }
                                if (col.isMoney) {
                                  return (
                                    <td key={colIdx} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{val ? `${val.toLocaleString(undefined, {style: 'currency', currency: row['Devise'] || 'CAD'})}` : '-'}</td>
                                  );
                                }
                                return (
                                  <td key={colIdx} className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-[200px]" title={val}>{val || '-'}</td>
                                );
                              })}
                              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white z-10 group-hover:bg-blue-50">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleEditContract(row)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded" title="Modifier"><Edit size={16} /></button>
                                  <button onClick={() => handleDeleteContract(row)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded" title="Supprimer"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
                    Affichage des 100 premiers résultats sur {filteredData.length}.
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="max-w-2xl mx-auto space-y-8 text-center pt-10">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Upload size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Importation de vos données</h2>
                <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer relative group bg-white shadow-sm">
                  <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="text-gray-500 group-hover:text-blue-500 transition-colors">
                    <p className="font-medium text-xl mb-2">Glissez votre fichier ici</p>
                    <p className="text-sm">{excelLibReady ? "Système prêt" : "Chargement..."}</p>
                  </div>
                </div>
              </div>
            )}

          </>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}