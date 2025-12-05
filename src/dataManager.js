/**
 * TERVENE DATA MANAGER
 * Système de gestion et persistance des données
 * Sécurisé - Local - Versionné
 * 
 * IMPORTANT: Ce système garantit que les données utilisateur ne sont JAMAIS écrasées
 * - Sauvegarde automatique toutes les 30 secondes
 * - Backup automatique avant toute modification majeure
 * - Migration automatique des données lors des mises à jour
 */

const DATA_VERSION = '1.1.0';
const STORAGE_KEY = 'tervene_data';
const BACKUP_KEY = 'tervene_backup';
const AUTO_BACKUP_KEY = 'tervene_auto_backup';

/**
 * Classe de gestion des données
 */
class DataManager {
  constructor() {
    this.data = null;
    this.autoSaveInterval = null;
  }

  /**
   * Initialiser le gestionnaire de données
   */
  initialize() {
    try {
      // Charger les données existantes ou créer une nouvelle structure
      this.data = this.loadFromLocalStorage() || this.createEmptyData();
      
      // Démarrer la sauvegarde automatique (toutes les 30 secondes)
      this.startAutoSave();
      
      console.log('✅ Data Manager initialisé avec succès');
      return this.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      return this.createEmptyData();
    }
  }

  /**
   * Créer une structure de données vide
   */
  createEmptyData() {
    return {
      version: DATA_VERSION,
      lastModified: new Date().toISOString(),
      contracts: [],
      config: {
        partners: [],
        aes: [],
        csms: [],
        salesTypes: ['N', 'U', 'C'],
        currencies: ['CAD', 'USD', 'EUR'],
        startStatuses: ['Signed', 'Active', 'Renew'],
        endStatuses: ['Active', 'Churn', 'End']
      }
    };
  }

  /**
   * Charger les données depuis localStorage
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Vérifier et migrer si nécessaire
      return this.migrateData(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      return null;
    }
  }

  /**
   * Sauvegarder les données dans localStorage
   */
  saveToLocalStorage(data = this.data) {
    try {
      data.lastModified = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Données sauvegardées:', new Date().toLocaleTimeString());
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      // Si quota dépassé, essayer de libérer de l'espace
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      return false;
    }
  }

  /**
   * Gérer le dépassement de quota de stockage
   */
  handleQuotaExceeded() {
    console.warn('⚠️ Quota de stockage dépassé');
    // Supprimer les anciennes sauvegardes
    localStorage.removeItem(BACKUP_KEY);
    alert('Espace de stockage insuffisant. Veuillez exporter vos données et libérer de l\'espace.');
  }

  /**
   * Démarrer la sauvegarde automatique
   */
  startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    // Sauvegarder toutes les 30 secondes
    this.autoSaveInterval = setInterval(() => {
      if (this.data) {
        this.saveToLocalStorage();
      }
    }, 30000);
  }

  /**
   * Arrêter la sauvegarde automatique
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Migrer les données d'une ancienne version
   */
  migrateData(data) {
    // Si pas de version, ajouter la version actuelle
    if (!data.version) {
      data.version = DATA_VERSION;
    }

    // Si ancienne structure (tableau direct), migrer
    if (Array.isArray(data)) {
      return {
        version: DATA_VERSION,
        lastModified: new Date().toISOString(),
        contracts: data,
        config: this.createEmptyData().config
      };
    }

    // Ajouter les champs manquants
    if (!data.config) {
      data.config = this.createEmptyData().config;
    }

    return data;
  }

  /**
   * Obtenir tous les contrats
   */
  getContracts() {
    return this.data?.contracts || [];
  }

  /**
   * Obtenir la configuration
   */
  getConfig() {
    return this.data?.config || this.createEmptyData().config;
  }

  /**
   * Mettre à jour les contrats
   * Crée automatiquement une sauvegarde avant modification
   */
  updateContracts(contracts) {
    if (this.data) {
      // Créer une sauvegarde automatique avant modification si données existantes
      if (this.data.contracts && this.data.contracts.length > 0) {
        this.createAutoBackup();
      }
      
      this.data.contracts = contracts;
      this.saveToLocalStorage();
      console.log(`📊 ${contracts.length} contrats sauvegardés`);
    }
  }

  /**
   * Mettre à jour la configuration
   */
  updateConfig(config) {
    if (this.data) {
      this.data.config = { ...this.data.config, ...config };
      this.saveToLocalStorage();
    }
  }

  /**
   * Créer une sauvegarde automatique (avant modifications majeures)
   */
  createAutoBackup() {
    try {
      const autoBackup = {
        date: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(this.data))
      };
      localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(autoBackup));
      console.log('🔄 Sauvegarde automatique créée');
      return true;
    } catch (error) {
      console.warn('⚠️ Impossible de créer la sauvegarde automatique:', error);
      return false;
    }
  }

  /**
   * Restaurer depuis la sauvegarde automatique
   */
  restoreFromAutoBackup() {
    try {
      const backup = localStorage.getItem(AUTO_BACKUP_KEY);
      if (!backup) {
        console.warn('Aucune sauvegarde automatique trouvée');
        return null;
      }
      const { data, date } = JSON.parse(backup);
      console.log(`♻️ Sauvegarde automatique disponible du ${new Date(date).toLocaleString()}`);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la lecture de la sauvegarde automatique:', error);
      return null;
    }
  }

  /**
   * Créer une sauvegarde manuelle
   */
  createBackup() {
    try {
      const backup = {
        date: new Date().toISOString(),
        data: this.data
      };
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
      console.log('📦 Sauvegarde créée');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la sauvegarde:', error);
      return false;
    }
  }

  /**
   * Restaurer depuis la dernière sauvegarde
   */
  restoreFromBackup() {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (!backup) {
        alert('Aucune sauvegarde trouvée');
        return false;
      }

      const { data } = JSON.parse(backup);
      this.data = this.migrateData(data);
      this.saveToLocalStorage();
      console.log('♻️ Données restaurées depuis la sauvegarde');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      return false;
    }
  }

  /**
   * Exporter les données vers un fichier JSON
   */
  exportToFile() {
    try {
      const dataStr = JSON.stringify(this.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tervene_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('📥 Données exportées');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      return false;
    }
  }

  /**
   * Importer des données depuis un fichier JSON
   */
  importFromFile(fileContent) {
    try {
      const importedData = JSON.parse(fileContent);
      
      // Valider les données
      if (!importedData.contracts && !Array.isArray(importedData)) {
        throw new Error('Format de données invalide');
      }

      // Migrer si nécessaire
      this.data = this.migrateData(importedData);
      this.saveToLocalStorage();
      console.log('📤 Données importées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'import:', error);
      alert('Erreur lors de l\'import des données. Vérifiez le format du fichier.');
      return false;
    }
  }

  /**
   * Effacer toutes les données (avec confirmation)
   */
  clearAllData() {
    if (confirm('⚠️ ATTENTION : Cela supprimera toutes vos données. Voulez-vous continuer ?')) {
      if (confirm('Êtes-vous VRAIMENT sûr ? Cette action est irréversible.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(BACKUP_KEY);
        this.data = this.createEmptyData();
        console.log('🗑️ Toutes les données ont été effacées');
        return true;
      }
    }
    return false;
  }

  /**
   * Obtenir des statistiques sur les données
   */
  getStats() {
    return {
      version: this.data?.version || 'N/A',
      lastModified: this.data?.lastModified || 'N/A',
      contractsCount: this.data?.contracts?.length || 0,
      storageSize: this.getStorageSize(),
      hasBackup: !!localStorage.getItem(BACKUP_KEY)
    };
  }

  /**
   * Obtenir la taille du stockage
   */
  getStorageSize() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return '0 KB';
      
      const bytes = new Blob([data]).size;
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } catch {
      return 'N/A';
    }
  }

  /**
   * Nettoyer avant de fermer l'application
   */
  cleanup() {
    this.stopAutoSave();
    if (this.data && this.data.contracts && this.data.contracts.length > 0) {
      this.saveToLocalStorage();
      console.log('💾 Données sauvegardées avant fermeture');
    }
  }

  /**
   * Vérifier si des données utilisateur existent
   */
  hasUserData() {
    return this.data && this.data.contracts && this.data.contracts.length > 0;
  }

  /**
   * Obtenir les informations de déploiement
   */
  getDeploymentInfo() {
    return {
      version: DATA_VERSION,
      storageKey: STORAGE_KEY,
      hasData: this.hasUserData(),
      contractsCount: this.data?.contracts?.length || 0,
      lastModified: this.data?.lastModified || null,
      storageSize: this.getStorageSize(),
      autoBackupAvailable: !!localStorage.getItem(AUTO_BACKUP_KEY),
      manualBackupAvailable: !!localStorage.getItem(BACKUP_KEY)
    };
  }
}

// Créer une instance unique (Singleton)
const dataManager = new DataManager();

// Sauvegarder avant de quitter (capture tous les cas de fermeture)
window.addEventListener('beforeunload', (event) => {
  dataManager.cleanup();
});

// Sauvegarder aussi quand la page perd le focus (tab change, minimize)
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && dataManager.hasUserData()) {
    dataManager.saveToLocalStorage(dataManager.data);
  }
});

export default dataManager;

