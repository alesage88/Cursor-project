# 🎯 Tervene - Système de Gestion des Licences

## 📋 Description

**Tervene License Manager** est une application web complète pour la gestion et la comptabilisation des licences logicielles. Elle offre une vue d'ensemble des contrats clients, des analyses financières détaillées (MRR), et des tableaux de bord interactifs pour suivre la croissance, le churn et la performance commerciale.

## ✨ Fonctionnalités Principales

### 📊 Dashboards Analytiques
- **Analyse Financière (MRR)** - Revenus récurrents mensuels avec graphiques de composition et variation
- **Indicateurs de Croissance** - Suivi du nombre de clients et contrats actifs
- **Analyse du Churn** - Visualisation des pertes de clients et MRR perdu
- **Performance A/E** - Classement des Account Executives par MRR généré
- **Matrice Client** - Vue temporelle du MRR par client avec drill-down par contrat

### 🎫 Gestion des Contrats
- Création, modification et suppression de contrats
- Distinction entre nouveaux clients et clients existants
- Calcul automatique des ID clients et contrats
- Support multi-devises (CAD, USD, EUR) avec conversion historique
- Gestion des types de vente (Nouveau, Upsell, Cross-sell)

### 📁 Import/Export
- Import de fichiers CSV et Excel (.xlsx, .xls)
- Export de matrices MRR vers Excel
- Chargement de données démo pour test

### ⚙️ Configuration
- Gestion dynamique des listes déroulantes (Partenaires, A/E, CSM, Statuts)
- Configuration des devises et types de vente
- Visualisation des taux de change historiques simulés

## 🚀 Installation

### Prérequis
- Node.js 16.x ou supérieur
- npm ou yarn

### Étapes d'Installation

1. **Cloner le projet**
```bash
cd tervene-license-manager
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application en mode développement**
```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

## 📦 Build de Production

Pour créer une version de production optimisée :

```bash
npm run build
```

Pour prévisualiser la version de production :

```bash
npm run preview
```

## 🛠️ Technologies Utilisées

- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Recharts** - Bibliothèque de graphiques React
- **Lucide React** - Icônes modernes
- **XLSX.js** - Manipulation de fichiers Excel

## 📖 Guide d'Utilisation

### 1. Vue Contrats Client
- Cliquez sur **"Nouveau Contrat"** pour ajouter un contrat
- Choisissez entre "Nouveau Client" ou "Client Existant"
- Remplissez les informations financières (MRR, devise, dates)
- Les ID sont générés automatiquement

### 2. Dashboards
- Naviguez entre les différents onglets via la sidebar
- Cliquez sur les graphiques de variation pour voir les détails mensuels
- Utilisez le sélecteur de devise (en haut à droite) pour changer la devise d'affichage

### 3. Import de Données
- Cliquez sur **"Importer"** dans l'onglet Contrats
- Sélectionnez un fichier CSV ou Excel
- Les données sont traitées localement (pas d'envoi serveur)

### 4. Export Excel
- Dans la **Matrice Client**, cliquez sur "Exporter vers Excel"
- Le fichier sera téléchargé avec formatage monétaire

### 5. Configuration
- Accédez à l'onglet **"Configuration"**
- Ajoutez/supprimez des partenaires, A/E, CSM, etc.
- Consultez la grille des taux de change historiques

## 📁 Structure du Projet

```
tervene-license-manager/
├── public/              # Fichiers statiques
├── src/
│   ├── App.jsx         # Composant principal (Dashboard + Modals)
│   ├── main.jsx        # Point d'entrée React
│   └── index.css       # Styles globaux + Tailwind
├── index.html          # Template HTML
├── package.json        # Dépendances npm
├── tailwind.config.js  # Configuration Tailwind
├── vite.config.js      # Configuration Vite
└── README.md           # Ce fichier
```

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies via Tailwind CSS. Pour les modifier :
- Sidebar : `bg-slate-900`
- Accent : `bg-blue-600`
- Churn/Erreurs : `bg-red-600`
- Succès : `bg-green-600`

### Données de Démo
Les données d'exemple se trouvent dans `SAMPLE_CSV_DATA` dans `src/App.jsx`. Vous pouvez les modifier ou les remplacer.

### Taux de Change
La fonction `getHistoricalRate()` simule des taux historiques. Pour utiliser de vrais taux, intégrez une API comme Open Exchange Rates.

## 🔒 Sécurité & Confidentialité

- **Aucune donnée envoyée en ligne** - Toutes les opérations sont locales
- Les fichiers importés sont traités dans le navigateur
- Aucun backend requis (application client-side seulement)

## 🐛 Débogage

Si vous rencontrez des problèmes :

1. **L'application ne démarre pas**
   ```bash
   # Supprimer node_modules et réinstaller
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Les graphiques ne s'affichent pas**
   - Vérifiez que recharts est bien installé
   - Inspectez la console du navigateur (F12)

3. **Import Excel ne fonctionne pas**
   - Vérifiez que XLSX.js se charge (voir Console)
   - Essayez de rafraîchir la page

## 📝 Format de Données CSV/Excel

Colonnes attendues :
- `Nom` - Nom du client
- `# client ID` - ID numérique du client
- `# contract` - Numéro du contrat
- `# contract ID` - ID du contrat (format: CCCCNN)
- `A/E` - Account Executive
- `CSM` - Customer Success Manager
- `Partenaire` - Nom du partenaire
- `Start Date` - Date de début (YYYY-MM-DD)
- `End date` - Date de fin (optionnel)
- `Start Status` / `End Status` - Statuts
- `Devise` - Devise (CAD, USD, EUR)
- `MRR` - Revenu récurrent mensuel
- `Up sell (U) or new client (N) or cross-sell (C)` - Type de vente

## 🤝 Contribution

Ce projet est un outil interne. Pour toute suggestion ou bug :
1. Ouvrez une issue
2. Décrivez le problème ou la fonctionnalité souhaitée
3. Ajoutez des captures d'écran si pertinent

## 📄 Licence

Propriétaire - Tervene © 2024

---

**Développé pour Tervene** - Gestion simplifiée des licences et revenus récurrents

Pour toute question technique : support@tervene.com






