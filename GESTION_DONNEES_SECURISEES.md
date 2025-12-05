# 🔒 Gestion Sécurisée des Données - Tervene

## 📋 Vue d'Ensemble

Votre application Tervene dispose maintenant d'un **système complet de gestion et de protection des données** qui garantit :

✅ **Sécurité** - Données stockées localement sur votre ordinateur  
✅ **Persistance** - Vos données ne sont jamais perdues  
✅ **Sauvegarde automatique** - Toutes les 30 secondes  
✅ **Protection contre les mises à jour** - Les données survivent aux mises à jour du logiciel  
✅ **Export/Import** - Sauvegardez et restaurez facilement  
✅ **Confidentialité** - Aucune donnée n'est envoyée en ligne  

---

## 🔐 Système de Stockage

### Où sont stockées vos données ?

Vos données sont stockées dans le **localStorage** de votre navigateur :
- 📍 **Emplacement** : Mémoire du navigateur (local)
- 🔒 **Sécurité** : Accessible uniquement par votre application
- 💾 **Capacité** : Environ 5-10 MB (suffisant pour des milliers de contrats)
- 🌐 **Hors ligne** : Fonctionne sans connexion internet

### Structure des Données

```javascript
{
  version: "1.0.0",              // Version des données
  lastModified: "2024-12-04",    // Dernière modification
  contracts: [...],              // Tous vos contrats
  config: {                      // Configuration
    partners: [...],
    aes: [...],
    csms: [...],
    ...
  }
}
```

---

## ⚙️ Fonctionnalités de Gestion

### 1️⃣ Sauvegarde Automatique

**Comment ça marche ?**
- ✅ Sauvegarde **automatique** toutes les 30 secondes
- ✅ Sauvegarde à la **fermeture** de l'application
- ✅ Sauvegarde après chaque **modification** importante

**Ce qui est sauvegardé automatiquement :**
- Ajout/modification/suppression de contrats
- Modifications de la configuration
- Importation de données
- Ajout de partenaires, A/E, CSM

**Indicateur de sauvegarde :**
```
💾 Données sauvegardées: 14:35:22
```
Visible dans la console du navigateur (F12)

---

### 2️⃣ Export des Données

#### Export JSON (Sauvegarde Complète)

**À utiliser pour :**
- 📦 Créer une sauvegarde de sécurité
- 💾 Archiver vos données
- 🔄 Transférer vers un autre ordinateur
- 📤 Partager avec un collègue

**Comment faire :**
1. Ouvrir l'application
2. Aller dans **Configuration** → **Gestion des Données**
3. Cliquer sur **"Exporter Données JSON"**
4. Le fichier est téléchargé : `tervene_backup_YYYY-MM-DD.json`

**Contenu du fichier :**
- ✅ Tous les contrats
- ✅ Toute la configuration
- ✅ Version des données
- ✅ Date de sauvegarde

#### Export Excel (Pour Analyse)

**Deux types d'export :**
- **Export Contrats** : Liste détaillée de tous les contrats
- **Export Matrice** : Vue temporelle du MRR par client

*(Voir NOUVELLE_FONCTIONNALITE_EXPORT.md pour plus de détails)*

---

### 3️⃣ Import des Données

#### Import JSON (Restauration)

**À utiliser pour :**
- ♻️ Restaurer une sauvegarde
- 🔄 Transférer depuis un autre ordinateur
- 📥 Importer des données d'un collègue

**Comment faire :**
1. Aller dans **Configuration** → **Gestion des Données**
2. Cliquer sur **"Importer Données JSON"**
3. Sélectionner votre fichier `.json`
4. ⚠️ **ATTENTION** : Cela remplacera vos données actuelles

**Sécurité :**
- ✅ Validation automatique du format
- ✅ Migration automatique si ancienne version
- ✅ Message d'erreur si fichier invalide

#### Import Excel/CSV (Ajout de Contrats)

**Pour ajouter des contrats :**
1. Aller dans **Contrat client**
2. Cliquer sur **"Importer"**
3. Sélectionner un fichier CSV ou Excel
4. Les contrats sont ajoutés et sauvegardés automatiquement

---

### 4️⃣ Sauvegarde Manuelle

**Créer une sauvegarde de sécurité :**

Dans la console du navigateur (F12) :
```javascript
dataManager.createBackup()
```

**Restaurer la dernière sauvegarde :**
```javascript
dataManager.restoreFromBackup()
```

---

### 5️⃣ Statistiques des Données

**Informations disponibles :**
- 📊 Nombre total de contrats
- 💾 Taille des données stockées
- 📅 Date de dernière modification
- 🔢 Version des données
- 💾 Présence d'une sauvegarde

**Accès :**
Dans la console (F12) :
```javascript
dataManager.getStats()
```

Résultat exemple :
```javascript
{
  version: "1.0.0",
  lastModified: "2024-12-04T14:35:22.000Z",
  contractsCount: 156,
  storageSize: "234.5 KB",
  hasBackup: true
}
```

---

## 🔄 Protection Contre les Mises à Jour

### Comment ça fonctionne ?

**Séparation Code / Données :**
```
📁 Projet Tervene
  ├── 📄 Code de l'application     ← Peut être mis à jour
  └── 💾 Données (localStorage)    ← Ne sont JAMAIS touchées
```

### Lors d'une mise à jour :

1. **Vous mettez à jour le code** :
   ```bash
   git pull
   npm install
   npm run dev
   ```

2. **Vos données restent intactes** :
   - ✅ Les contrats sont préservés
   - ✅ La configuration est préservée
   - ✅ L'historique est préservé

3. **Migration automatique** (si nécessaire) :
   - Le système détecte la version des données
   - Applique les migrations nécessaires
   - Conserve toutes les informations

### Exemple de Migration

**Ancienne version (v1.0.0)** :
```javascript
{
  contracts: [...]  // Structure simple
}
```

**Nouvelle version (v2.0.0)** :
```javascript
{
  version: "2.0.0",
  contracts: [...],
  config: {...},       // ← Ajouté automatiquement
  newFeature: {...}    // ← Nouvelle fonctionnalité
}
```

**Résultat** : Vos données sont automatiquement migrées sans perte !

---

## 📋 Meilleures Pratiques

### Sauvegarde Régulière

**Fréquence recommandée :**
- 📅 **Quotidienne** : Si vous modifiez beaucoup de données
- 📅 **Hebdomadaire** : Pour une utilisation normale
- 📅 **Mensuelle** : Minimum absolu

**Méthode :**
1. Export JSON via l'interface
2. Sauvegarder sur un disque externe ou cloud
3. Nommer clairement : `tervene_backup_2024-12-04.json`

### Organisation des Sauvegardes

```
📁 Sauvegardes Tervene
  ├── 📁 2024-12
  │   ├── tervene_backup_2024-12-01.json
  │   ├── tervene_backup_2024-12-08.json
  │   ├── tervene_backup_2024-12-15.json
  │   └── tervene_backup_2024-12-22.json
  └── 📁 2024-11
      └── ...
```

### Avant une Mise à Jour

**Checklist de sécurité :**
- [ ] Créer un export JSON complet
- [ ] Vérifier que le fichier est téléchargé
- [ ] Optionnel : Copier sur un autre support
- [ ] Procéder à la mise à jour
- [ ] Vérifier que les données sont toujours là

---

## 🆘 Récupération d'Urgence

### Scénario 1 : Données Supprimées par Erreur

**Solution :**
1. Importer le dernier fichier JSON sauvegardé
2. Ou restaurer depuis le backup automatique (console F12) :
   ```javascript
   dataManager.restoreFromBackup()
   ```

### Scénario 2 : Navigateur Réinitialisé

**Solution :**
1. Ouvrir l'application
2. Importer le dernier fichier JSON
3. Vos données sont restaurées

### Scénario 3 : Changement d'Ordinateur

**Solution :**
1. Sur l'ancien PC : Exporter JSON
2. Copier le fichier sur le nouveau PC
3. Sur le nouveau PC : Importer JSON

### Scénario 4 : Données Corrompues

**Solution :**
1. Essayer de restaurer le backup automatique
2. Sinon, importer la dernière sauvegarde JSON
3. En dernier recours, réimporter depuis Excel

---

## 🔍 Dépannage

### Les données ne se sauvegardent pas

**Causes possibles :**
- ❌ Navigation en mode privé/incognito
- ❌ Cookies désactivés
- ❌ Espace de stockage plein

**Solutions :**
1. Vérifier que vous n'êtes pas en mode privé
2. Autoriser les cookies pour localhost
3. Libérer de l'espace disque

### Message "Quota Dépassé"

**Solution :**
1. Exporter vos données JSON
2. Nettoyer le localStorage :
   ```javascript
   dataManager.clearAllData()
   ```
3. Réimporter vos données
4. Ou exporter régulièrement en Excel et garder moins d'historique

### Les données disparaissent après fermeture

**Cause :** Mode privé ou cookies désactivés

**Solution :**
- Utiliser le navigateur en mode normal
- Activer les cookies pour localhost
- Exporter/importer à chaque session si nécessaire

---

## 🔐 Sécurité et Confidentialité

### Où vont les données ?

**NULLE PART !**

- ✅ Stockage **100% local**
- ✅ **Aucun serveur** impliqué
- ✅ **Aucune connexion internet** nécessaire
- ✅ **Aucune télémétrie**
- ✅ **Aucun tracking**

### Qui peut accéder aux données ?

**Seulement VOUS !**

- ✅ Données dans votre navigateur
- ✅ Sur votre ordinateur
- ✅ Protégées par votre session Windows
- ✅ Pas accessibles par d'autres sites

### Protection contre les Fuites

**Le système n'envoie JAMAIS :**
- ❌ Données à un serveur
- ❌ Statistiques d'utilisation
- ❌ Informations de contrats
- ❌ Informations personnelles

### Recommandations de Sécurité

1. **Chiffrement du disque** : Activez BitLocker (Windows)
2. **Sauvegarde chiffrée** : Stockez les exports JSON sur un disque chiffré
3. **Verrouillage PC** : Verrouillez toujours votre session
4. **Mot de passe** : Protégez votre session Windows

---

## 📞 Support

### En cas de problème

1. **Consulter ce guide**
2. **Vérifier la console** (F12) pour les messages
3. **Exporter les données** en préventif
4. **Contacter le support** avec :
   - Description du problème
   - Messages d'erreur (console)
   - Version du navigateur
   - Étapes pour reproduire

---

## 🎯 Résumé

### ✅ Vos Données Sont :
- **Sécurisées** - Stockage local uniquement
- **Persistantes** - Sauvegarde automatique
- **Protégées** - Survivent aux mises à jour
- **Exportables** - JSON et Excel
- **Récupérables** - Backup automatique
- **Privées** - Aucun envoi en ligne

### 🛡️ Garanties :
- ✅ Pas de perte lors des mises à jour
- ✅ Pas de fuite de données
- ✅ Pas de serveur externe
- ✅ Contrôle total sur vos données

---

**Vos données d'entreprise sont en sécurité avec Tervene ! 🔒**

*Dernière mise à jour : Décembre 2024*






