# 🚀 Guide de Déploiement Local - Tervene License Manager

## ✅ Révisions Effectuées

### 🔒 Protection des Données (Contrat Client)

Les données utilisateur sont **PROTÉGÉES** contre l'écrasement :

#### 1. **Hiérarchie de Chargement**
```
1. Données utilisateur (localStorage) → PRIORITÉ ABSOLUE
2. Sauvegarde automatique → Si données corrompues
3. Données démo → SEULEMENT si aucune donnée existante
```

#### 2. **Sauvegardes Automatiques**
- ✅ **Avant chaque modification** : Sauvegarde automatique créée
- ✅ **Toutes les 30 secondes** : Sauvegarde périodique
- ✅ **À la fermeture** : Sauvegarde avant de quitter
- ✅ **Au changement d'onglet** : Sauvegarde quand on quitte la page

#### 3. **Stockage Sécurisé**
```javascript
// 3 niveaux de protection dans localStorage
tervene_data        // Données principales
tervene_backup      // Sauvegarde manuelle
tervene_auto_backup // Sauvegarde automatique (avant modifications)
```

#### 4. **Données Démo**
- Les données démo ne sont **JAMAIS** sauvegardées automatiquement
- Elles ne s'affichent que si **AUCUNE** donnée utilisateur n'existe
- L'import de fichier **remplace** les données démo par vos données

---

## 🖥️ Déploiement Local

### Prérequis
1. **Node.js** v18+ installé
2. **npm** ou **yarn**

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer en mode développement
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

### Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run start` | Alias pour dev |
| `npm run build` | Crée une version de production |
| `npm run preview` | Prévisualise la version de production |
| `npm run serve` | Prévisualise sur le réseau local |

---

## 🔄 Cycle de Vie des Données

### Au Démarrage

```
Application démarre
        ↓
dataManager.initialize()
        ↓
Données dans localStorage ?
    ├── OUI → Charger les données utilisateur
    │         setIsFileUploaded(true)
    │         ✅ Données protégées
    │
    └── NON → Charger données démo
              setIsFileUploaded(false)
              ⚠️ Mode démo (non sauvegardé)
```

### À l'Import de Fichier

```
Utilisateur importe un fichier
        ↓
Création backup automatique (si données existantes)
        ↓
Parsing du fichier (CSV ou Excel)
        ↓
updateAndSaveData(newData)
        ↓
dataManager.updateContracts(contracts)
        ↓
Sauvegarde dans localStorage
        ↓
setIsFileUploaded(true)
        ↓
✅ Données sauvegardées et protégées
```

### À la Modification

```
Utilisateur modifie/ajoute/supprime un contrat
        ↓
Création backup automatique
        ↓
updateAndSaveData(modifiedData)
        ↓
Sauvegarde immédiate dans localStorage
        ↓
✅ Modification persistée
```

### À la Fermeture

```
Utilisateur ferme l'onglet/navigateur
        ↓
Event: beforeunload
        ↓
dataManager.cleanup()
        ↓
Sauvegarde finale des données
        ↓
✅ Aucune perte de données
```

---

## 🛡️ Garanties de Sécurité des Données

### ✅ Ce qui est PROTÉGÉ

| Donnée | Protection |
|--------|------------|
| Contrats importés | ✅ Sauvegardés automatiquement |
| Contrats ajoutés manuellement | ✅ Sauvegardés automatiquement |
| Modifications de contrats | ✅ Sauvegardés automatiquement |
| Configuration | ✅ Sauvegardée automatiquement |

### ❌ Ce qui n'est PAS sauvegardé

| Donnée | Raison |
|--------|--------|
| Données démo | Données d'exemple uniquement |
| Filtres de recherche | État temporaire de l'UI |
| Onglet actif | État temporaire de l'UI |

---

## 📊 Vérification des Données

### Console du Navigateur

Ouvrez la console (F12) pour voir :

```javascript
// Au démarrage
✅ Data Manager initialisé avec succès
📊 Info déploiement: {
  version: "1.1.0",
  hasData: true,
  contractsCount: 45,
  lastModified: "2024-12-04T...",
  storageSize: "12.5 KB"
}

// Lors des sauvegardes
💾 Données sauvegardées: 14:30:25
📊 45 contrats sauvegardés
```

### Inspection localStorage

```javascript
// Dans la console du navigateur
localStorage.getItem('tervene_data')
```

---

## 🔧 Dépannage

### Problème : Données perdues après mise à jour

**Solution** : Vos données ne sont JAMAIS perdues. Vérifiez :

```javascript
// Dans la console
localStorage.getItem('tervene_data')      // Données principales
localStorage.getItem('tervene_backup')    // Backup manuel
localStorage.getItem('tervene_auto_backup') // Backup auto
```

### Problème : Données démo apparaissent au lieu des miennes

**Causes possibles** :
1. Le navigateur a effacé le localStorage (navigation privée)
2. Un autre navigateur est utilisé

**Solution** :
1. Utilisez toujours le même navigateur
2. N'utilisez pas la navigation privée
3. Exportez vos données régulièrement (JSON)

### Restaurer depuis une sauvegarde

Dans la console :
```javascript
// Voir si une sauvegarde existe
const backup = localStorage.getItem('tervene_auto_backup');
console.log(JSON.parse(backup));

// Restaurer manuellement
localStorage.setItem('tervene_data', backup);
location.reload();
```

---

## 📦 Build de Production

Pour créer une version optimisée :

```bash
npm run build
```

Cela crée un dossier `dist/` avec :
- `index.html` - Point d'entrée
- `assets/` - JavaScript et CSS optimisés

### Servir la version de production

```bash
npm run preview
# ou pour accès réseau local
npm run serve
```

---

## 🌐 Déploiement sur Réseau Local

Pour accéder depuis d'autres ordinateurs :

```bash
npm run dev
# ou
npm run serve
```

L'application sera accessible via :
- `http://localhost:3000` (local)
- `http://[VOTRE-IP]:3000` (réseau local)

---

## 📋 Checklist de Déploiement

### Avant le déploiement
- [ ] `npm install` exécuté
- [ ] Pas d'erreurs dans la console
- [ ] Données de test importées et vérifiées

### Après le déploiement
- [ ] Application accessible sur le port 3000
- [ ] Import de fichier fonctionne
- [ ] Données sauvegardées après refresh (F5)
- [ ] Export Excel fonctionne
- [ ] Drill-down sur graphiques fonctionne

### Maintenance
- [ ] Exporter les données régulièrement (JSON backup)
- [ ] Vérifier les logs console pour erreurs
- [ ] Mettre à jour Node.js si nécessaire

---

## 💡 Bonnes Pratiques

### 1. Export Régulier
Exportez vos données régulièrement via l'onglet Import :
- Bouton "Exporter JSON" → Crée un fichier de backup

### 2. Un Seul Navigateur
Utilisez toujours le même navigateur pour accéder à l'application.

### 3. Pas de Navigation Privée
Le mode privé efface le localStorage à la fermeture.

### 4. Backup Manuel
Avant une mise à jour majeure, créez un backup manuel via l'interface.

---

## 🎯 Résumé

| Aspect | Statut |
|--------|--------|
| Protection des données | ✅ Garantie |
| Sauvegarde automatique | ✅ Active |
| Backup avant modification | ✅ Automatique |
| Données démo isolées | ✅ Non sauvegardées |
| Build production | ✅ Optimisé |
| Réseau local | ✅ Supporté |

---

**Version** : 1.1.0  
**Date** : 4 Décembre 2024  
**Statut** : ✅ Prêt pour déploiement local






