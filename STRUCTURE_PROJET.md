# 📁 Structure du Projet - Tervene License Manager

## Arborescence Complète

```
tervene-license-manager/
│
├── 📁 public/                      # Fichiers statiques
│   └── favicon.svg                 # Icône Tervene (logo T bleu)
│
├── 📁 src/                         # Code source
│   ├── App.jsx                     # ⭐ Application principale (1780 lignes)
│   ├── main.jsx                    # Point d'entrée React
│   └── index.css                   # Styles globaux + Tailwind
│
├── 📁 .vscode/                     # Configuration VS Code
│   └── extensions.json             # Extensions recommandées
│
├── 📄 Configuration
│   ├── package.json                # Dépendances npm
│   ├── vite.config.js              # Configuration Vite
│   ├── tailwind.config.js          # Configuration Tailwind CSS
│   ├── postcss.config.js           # Configuration PostCSS
│   └── .gitignore                  # Fichiers à ignorer par Git
│
├── 📄 Documentation
│   ├── README.md                   # Documentation complète
│   ├── DEMARRAGE_RAPIDE.md         # Guide de démarrage
│   └── STRUCTURE_PROJET.md         # Ce fichier
│
└── index.html                      # Template HTML principal
```

---

## 📦 Dépendances Principales

### Production
- **react** ^18.2.0 - Framework UI
- **react-dom** ^18.2.0 - DOM virtuel React
- **recharts** ^2.10.3 - Graphiques interactifs
- **lucide-react** ^0.294.0 - Bibliothèque d'icônes

### Développement
- **vite** ^5.0.8 - Build tool ultra-rapide
- **@vitejs/plugin-react** ^4.2.1 - Plugin React pour Vite
- **tailwindcss** ^3.3.6 - Framework CSS utility-first
- **autoprefixer** ^10.4.16 - Préfixes CSS automatiques
- **postcss** ^8.4.32 - Transformation CSS

### Externe (CDN)
- **XLSX.js** (chargé dynamiquement) - Import/Export Excel

---

## 🎨 Architecture de l'Application

### Composant Principal: `App.jsx`

#### 1. Composants UI de Base
```javascript
- Card             // Container générique
- MetricCard       // Carte de métriques KPI
- ConfigList       // Liste configurable (ajout/suppression)
```

#### 2. État Global (useState)
```javascript
- activeTab        // Onglet actif
- rawData          // Données brutes importées
- filteredData     // Données filtrées/triées
- searchTerm       // Terme de recherche
- sortConfig       // Configuration du tri
- config           // Configuration (partenaires, AE, CSM, etc.)
- displayCurrency  // Devise d'affichage (CAD/USD/EUR)
- drillDownData    // Données du modal drill-down
```

#### 3. Logique Métier
```javascript
- parseCSV()                // Parse CSV manuel
- processRawRows()          // Traite les lignes brutes
- getHistoricalRate()       // Simule taux de change historiques
- calculateIds()            // Génère IDs clients/contrats
- kpis (useMemo)           // Calcule tous les KPIs
```

#### 4. Modules Principaux
- **Modals**: Import, Ajout/Édition, Drill-Down
- **Sidebar**: Navigation entre onglets
- **Dashboards**: MRR, Growth, Churn, Performance, Matrice
- **Table**: Liste des contrats avec actions CRUD

---

## 🔄 Flux de Données

```
1. Import CSV/Excel
   ↓
2. parseCSV() ou XLSX.read()
   ↓
3. processRawRows()
   ↓
4. rawData (state)
   ↓
5. kpis (useMemo) ← Calcul de tous les indicateurs
   ↓
6. Affichage dans les dashboards
```

---

## 🎯 Points d'Extension

### Ajouter un Nouveau Dashboard
1. Ajouter un bouton dans la Sidebar
2. Créer le contenu dans `{activeTab === 'nouveau' && (...)}`
3. Utiliser `kpis` pour accéder aux données calculées

### Ajouter un Nouveau KPI
1. Modifier la fonction `kpis` (useMemo)
2. Calculer le KPI à partir de `rawData`
3. Retourner la nouvelle valeur dans l'objet `return { ... }`

### Modifier les Taux de Change
1. Éditer la fonction `getHistoricalRate()`
2. Ou intégrer une API (Open Exchange Rates, etc.)

### Ajouter un Export
1. S'inspirer de `exportMatrixToExcel()`
2. Utiliser XLSX.js pour créer le fichier
3. Déclencher le téléchargement

---

## 🚀 Scripts Disponibles

```bash
npm run dev      # Lancer en mode développement (port 3000)
npm run build    # Build de production (dossier dist/)
npm run preview  # Prévisualiser le build
```

---

## 🔐 Sécurité & Performance

### Sécurité
- ✅ Aucune donnée envoyée au serveur
- ✅ Traitement 100% local (client-side)
- ✅ Pas de dépendances vulnérables connues

### Performance
- ✅ useMemo pour les calculs lourds
- ✅ Virtualisation des grands tableaux (slice(0, 100))
- ✅ Debouncing de la recherche
- ✅ Lazy loading des graphiques

---

## 📊 Métriques du Code

- **Lignes de Code**: ~1800 (App.jsx)
- **Composants React**: 3 (Card, MetricCard, ConfigList)
- **Dashboards**: 6 (MRR, Growth, Churn, Performance, Matrice, Config)
- **Modals**: 3 (Import, Ajout/Édition, Drill-Down)

---

## 🎓 Concepts Utilisés

- **React Hooks**: useState, useEffect, useMemo, useRef
- **Composants Contrôlés**: Formulaires avec state
- **Conditional Rendering**: {condition && <Component />}
- **Event Handling**: onClick, onChange, onSubmit
- **Array Methods**: map, filter, sort, reduce
- **Date Manipulation**: new Date(), getTime(), toLocaleDateString()

---

**Dernière mise à jour**: Décembre 2024






