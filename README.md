```markdown
# GreatCorner — Projet Fil Rouge 1

> **GreatCorner** est une plateforme de petites annonces, développée en **Node.js** (backend) et **Next.js** (frontend), avec une base de données **PostgreSQL**.

---

## 🧑 Membres du groupe

- **HUANG Edric**  
- **DUPILLE Benjamin**  
- **BOURICH Théo**  

---

## 📂 Structure du projet

```
Projet_Fil_Rouge_1/
├─ backend/                            # Backend Express
│  ├─ models/                          # Accès BDD
│  ├─ index.js                         # Point d’entrée serveur
│  └─ .env                             # Variables d’environnement pour le backend
├─ database/                           # Fichiers BDD PostgreSQL
│     ├─ greatcorner.sql               # Scripts de création des tables
│     └─ greatcorner_data_test.sql    # Données de test
├─ frontend/greatcorner/               # Frontend Next.js
│  ├─ app/                             # Composants et pages
│  └─ public/                          # Assets (images, logos…)
└─ README.md                           # Ce document
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/FireAEM/Projet_Fil_Rouge_1.git
cd Projet_Fil_Rouge_1
```

### 2. Configuration des variables d’environnement

Créez un fichier `.env` ou dans `backend/` contenant :

```dotenv
# Database
DB_HOST=[à compléter]
DB_USER=[à compléter]
DB_PASSWORD=[à compléter]
DB_NAME=greatcorner_projet_fil_rouge
DB_PORT=5432
```

### 3. Initialiser la base de données

1. Démarrez PostgreSQL et connectez‑vous (pgAdmin, psql…).
2. Créez une base de données `greatcorner_projet_fil_rouge` (ou adaptez `DB_NAME` dans `.env`).
3. Exécutez le script de création de schéma :

   ```bash
   psql -U [votre_user] -d greatcorner_projet_fil_rouge -f database/greatcorner.sql
   ```

4. (Facultatif) Chargez les données de test :

   ```bash
   psql -U [votre_user] -d greatcorner_projet_fil_rouge -f database/greatcorner_data_test.sql
   ```

> ⚠️ Si vous insérez manuellement des utilisateurs, leurs mots de passe doivent être hashés.

### 4. Installer les dépendances

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend/greatcorner
npm install
```

### 5. Lancer l’application

#### Backend
Assurez-vous d’être dans le dossier `/backend` :  
```bash
cd backend
node index.js
# écoute sur http://localhost:3000
```

#### Frontend
Passez au dossier `/frontend/greatcorner` et lancez l’application Next.js :  
```bash
cd ../frontend/greatcorner
npm run dev
# accès sur http://localhost:3005
```

---

## 🌐 Points d’accès

- **API** : `http://localhost:3000`
- **Frontend** : `http://localhost:3005`

---

## 🛠️ Technologies

- **Backend** : Node.js, Express, `express-session`, `bcrypt`
- **Frontend** : Next.js, React
- **Base de données** : PostgreSQL

---

## 🧑‍💻 Fonctionnalités principales

- Gestion des utilisateurs (inscription, connexion, rôle `client` / `admin`)
- Création, modification, suppression d’annonces
- Filtres et recherche (titre, catégorie, prix, tri)
- Favoris, messagerie interne (envoi automatique de message au vendeur)
- Dashboard client (mes annonces) et admin (gestion des annonces et utilisateurs)