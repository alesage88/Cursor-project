# 🚀 Démarrage Rapide - Tervene License Manager

## Installation en 3 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```
*Durée: ~2-3 minutes selon votre connexion*

### 2️⃣ Lancer l'application
```bash
npm run dev
```

### 3️⃣ Ouvrir dans le navigateur
L'application s'ouvre automatiquement sur **http://localhost:3000**

---

## 🎯 Première Utilisation

### Mode Démo
L'application démarre avec des données d'exemple. Vous pouvez :
- Explorer les différents dashboards via la sidebar
- Voir les analyses MRR, Croissance, Churn, Performance
- Tester les fonctionnalités sans données réelles

### Importer vos données
1. Cliquez sur **"Importer"** dans l'onglet "Contrat client"
2. Sélectionnez votre fichier CSV ou Excel
3. Les données seront automatiquement analysées et visualisées

### Format des données attendu
Votre fichier Excel/CSV doit contenir ces colonnes :
- Nom (client)
- Start Date (date de début)
- MRR (revenu mensuel)
- Devise (CAD, USD, EUR)
- A/E, CSM, Partenaire (optionnel)

---

## 📊 Fonctionnalités Principales

### Dashboards Disponibles
- **Revenus** - Analyse MRR avec graphiques de composition
- **Croissance** - Évolution du nombre de clients
- **Churn** - Analyse des pertes de clients
- **Performance A/E** - Classement des vendeurs
- **Matrice Client** - Vue temporelle MRR par client

### Actions Rapides
- **Nouveau Contrat** → Bouton bleu en haut à droite
- **Exporter Excel** → Dans l'onglet Matrice Client
- **Changer de devise** → Sélecteur en haut à droite (CAD/USD/EUR)

---

## ❓ Problèmes Courants

### L'application ne démarre pas
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Les graphiques ne s'affichent pas
- Rafraîchir la page (F5)
- Vider le cache du navigateur (Ctrl+Shift+R)

### L'import Excel ne fonctionne pas
- Vérifier que le fichier est bien au format .xlsx ou .csv
- Rafraîchir la page et réessayer

---

## 💡 Astuces

1. **Cliquez sur les graphiques de variation** pour voir le détail des mouvements mensuels
2. **Utilisez la recherche** pour filtrer rapidement les contrats
3. **Personnalisez les listes** dans l'onglet Configuration
4. **Exportez en Excel** pour partager les matrices MRR

---

## 🔧 Build de Production

Pour créer une version optimisée :
```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

---

**Support** : Pour toute question, consultez le README.md complet






