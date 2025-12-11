# 📅 HKEYITNA - Application de Synchronisation EDT/Outlook

Application web professionnelle de synchronisation bidirectionnelle entre emploi du temps (EDT) et Microsoft Outlook.

---

## 📋 Table des matières

- [Description](#description)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement de l'application](#lancement-de-lapplication)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Utilisation](#utilisation)
- [Dépannage](#dépannage)

---

## 🎯 Description

**HKEYITNA** est une application web moderne permettant de synchroniser automatiquement les événements entre un emploi du temps et Microsoft Outlook. L'application offre une interface intuitive pour gérer les événements et visualiser les logs de synchronisation en temps réel.

### Fonctionnalités principales :
- ✅ Authentification sécurisée avec JWT
- ✅ Gestion complète des événements (CRUD)
- ✅ Synchronisation bidirectionnelle EDT ↔ Outlook (Mode MOCK)
- ✅ Dashboard avec statistiques en temps réel
- ✅ Historique des synchronisations
- ✅ Interface responsive (mobile, tablet, desktop)
- ✅ Design moderne basé sur Argon Dashboard

---

## 🛠️ Technologies utilisées

### Backend
- **Java 17** - Langage de programmation
- **Spring Boot 3.5.7** - Framework backend
- **Spring Security** - Authentification et sécurité
- **JWT (JSON Web Token)** - Gestion des sessions
- **PostgreSQL** - Base de données
- **Maven** - Gestionnaire de dépendances

### Frontend
- **React 18.2.0** - Framework JavaScript
- **React Router 6** - Navigation
- **Reactstrap** - Composants UI Bootstrap
- **Axios** - Requêtes HTTP
- **Argon Dashboard React** - Template UI professionnel

---

## 📦 Prérequis

### Logiciels requis
- **Java JDK 17** ou supérieur
- **Node.js 18** ou supérieur
- **npm 9** ou supérieur
- **PostgreSQL 14** ou supérieur
- **Git** (optionnel)

### Vérifier les versions installées
```bash
java -version
node -v
npm -v
psql --version
```

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd application_web
```

### 2. Configuration de la base de données PostgreSQL

#### Créer la base de données
```sql
-- Connectez-vous à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE syncapp;

-- Créer l'utilisateur
CREATE USER syncuser WITH PASSWORD 'syncpass';

-- Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE syncapp TO syncuser;

-- Se connecter à la base
\c syncapp

-- Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO syncuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO syncuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO syncuser;

-- Quitter
\q
```

#### Créer les tables
Les tables seront créées automatiquement au premier lancement grâce à JPA/Hibernate.

### 3. Installation du Backend

```bash
cd hkeyitna

# Si vous utilisez Windows PowerShell
$env:JAVA_HOME='C:\Program Files\Java\jdk-17'
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"

# Compiler le projet
.\mvnw.cmd clean install -DskipTests

# Ou sur Linux/Mac
./mvnw clean install -DskipTests
```

### 4. Installation du Frontend

```bash
cd ../argon-dashboard-react-master/argon-dashboard-react-master

# Installer les dépendances
npm install
```

---

## ⚙️ Configuration

### Backend - `application.properties`

Fichier : `hkeyitna/src/main/resources/application.properties`

```properties
# Configuration du serveur
server.port=8080

# Configuration PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/syncapp
spring.datasource.username=syncuser
spring.datasource.password=syncpass
spring.datasource.driver-class-name=org.postgresql.Driver

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Configuration JWT
app.jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
app.jwt.expiration=86400000

# Mode Mock pour synchronisation (pas besoin de Microsoft 365)
app.sync.mock-mode=true

# CORS
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend - Configuration API

Fichier : `argon-dashboard-react-master/argon-dashboard-react-master/src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🎬 Lancement de l'application

### 1. Démarrer le Backend

```bash
cd hkeyitna

# Windows PowerShell
$env:JAVA_HOME='C:\Program Files\Java\jdk-17'
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Le backend sera accessible sur : **http://localhost:8080**

### 2. Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd argon-dashboard-react-master/argon-dashboard-react-master

# Démarrer le serveur de développement
npm start
```

Le frontend sera accessible sur : **http://localhost:3000**

### 3. Accéder à l'application

Ouvrez votre navigateur et accédez à :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **Health Check** : http://localhost:8080/actuator/health

---

## 🎨 Fonctionnalités

### 1. Authentification
- **Inscription** : Créer un nouveau compte utilisateur
- **Connexion** : Se connecter avec email/mot de passe
- **JWT** : Token sécurisé stocké dans localStorage
- **Routes protégées** : Accès restreint aux utilisateurs authentifiés

### 2. Dashboard
- **Statistiques** : Nombre total d'événements, EDT, Outlook
- **Événements récents** : Liste des 5 derniers événements
- **Logs de synchronisation** : Historique des 5 dernières synchros
- **Graphiques** : Évolution mensuelle des événements

### 3. Gestion des événements
- **Liste** : Afficher tous les événements
- **Créer** : Ajouter un nouvel événement (titre, description, date, lieu, source)
- **Modifier** : Éditer un événement existant
- **Supprimer** : Supprimer un événement
- **Filtrage** : Par source (EDT/OUTLOOK)

### 4. Synchronisation
- **PUSH** : Envoyer les événements EDT vers Outlook
- **PULL** : Récupérer les événements Outlook vers EDT
- **Mode MOCK** : Simulation sans compte Microsoft 365 réel
- **Statistiques** : Nombre d'événements synchronisés
- **Logs** : Historique détaillé avec statut SUCCESS/ERROR
- **Auto-refresh** : Actualisation automatique toutes les 30 secondes

### 5. Interface utilisateur
- **Responsive** : S'adapte à tous les écrans (mobile, tablet, desktop)
- **Design moderne** : Basé sur Argon Dashboard
- **Navigation intuitive** : Sidebar avec icônes
- **Notifications** : Messages de succès/erreur
- **Loading states** : Indicateurs de chargement

---

## 🏗️ Architecture

### Structure du projet

```
application_web/
├── hkeyitna/                           # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/esprit/tn/hkeyitna/
│   │   │   │   ├── config/           # Configuration (CORS, Security, JWT)
│   │   │   │   ├── controller/       # Controllers REST
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # Entités JPA
│   │   │   │   ├── repository/       # Repositories JPA
│   │   │   │   ├── security/         # JWT & Security
│   │   │   │   └── service/          # Services métier
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml                        # Dépendances Maven
│   └── mvnw.cmd                       # Maven Wrapper
│
├── argon-dashboard-react-master/
│   └── argon-dashboard-react-master/  # Frontend React
│       ├── public/
│       ├── src/
│       │   ├── assets/                # CSS, images, fonts
│       │   ├── components/            # Composants réutilisables
│       │   ├── contexts/              # Context API (Auth)
│       │   ├── layouts/               # Layouts (Admin, Auth)
│       │   ├── services/              # API services
│       │   ├── views/                 # Pages
│       │   │   ├── Index.js          # Dashboard
│       │   │   └── examples/
│       │   │       ├── Login.js
│       │   │       ├── Register.js
│       │   │       ├── Events.js
│       │   │       └── Sync.js
│       │   ├── index.js              # Point d'entrée
│       │   └── routes.js             # Routes
│       └── package.json              # Dépendances npm
│
├── docker-compose.yml                # Configuration Docker
└── README.md                         # Ce fichier
```

### Architecture technique

```
┌─────────────┐      HTTP/REST      ┌─────────────┐      JDBC      ┌─────────────┐
│   React     │ ◄──────────────────► │ Spring Boot │ ◄─────────────► │ PostgreSQL  │
│  Frontend   │   JSON + JWT Token   │   Backend   │   SQL Queries  │  Database   │
│  (Port 3000)│                      │ (Port 8080) │                │ (Port 5432) │
└─────────────┘                      └─────────────┘                └─────────────┘
```

---

## 📡 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription | `{username, email, password}` |
| POST | `/api/auth/login` | Connexion | `{username, password}` |

### Événements

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/events` | Liste des événements | ✅ |
| GET | `/api/events/{id}` | Détails d'un événement | ✅ |
| POST | `/api/events` | Créer un événement | ✅ |
| PUT | `/api/events/{id}` | Modifier un événement | ✅ |
| DELETE | `/api/events/{id}` | Supprimer un événement | ✅ |

### Synchronisation

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/sync/push` | EDT → Outlook | ✅ |
| POST | `/api/sync/pull` | Outlook → EDT | ✅ |
| GET | `/api/sync-logs` | Historique des synchros | ✅ |

---

## 💡 Utilisation

### Première utilisation

1. **Créer un compte**
   - Accédez à http://localhost:3000
   - Cliquez sur "S'inscrire"
   - Remplissez le formulaire (nom, email, mot de passe)
   - Cliquez sur "Créer un compte"

2. **Se connecter**
   - Utilisez vos identifiants
   - Vous serez redirigé vers le dashboard

3. **Créer des événements**
   - Allez dans "Événements"
   - Cliquez sur "Ajouter un événement"
   - Remplissez le formulaire :
     * Titre : "Cours de Math"
     * Description : "Algèbre linéaire"
     * Date de début : 2025-11-15 09:00
     * Date de fin : 2025-11-15 11:00
     * Lieu : Sélectionnez un pays
     * Source : EDT ou OUTLOOK
   - Cliquez sur "Créer"

4. **Synchroniser**
   - Allez dans "Synchronisation"
   - Cliquez sur "PUSH" pour envoyer EDT → Outlook
   - Cliquez sur "PULL" pour récupérer Outlook → EDT
   - Consultez les logs en bas de page

### Mode MOCK

Le mode MOCK est activé par défaut (`app.sync.mock-mode=true`). Il permet de tester l'application sans compte Microsoft 365 réel.

**Comportement en mode MOCK :**
- PUSH : Crée des événements "OUTLOOK" fictifs à partir des événements "EDT"
- PULL : Récupère tous les événements "OUTLOOK" existants
- Les événements sont créés dans la même base de données
- Aucune connexion externe n'est nécessaire

---

## 🔧 Dépannage

### Problème : Backend ne démarre pas

**Erreur** : `Cannot connect to database`

**Solution** :
```bash
# Vérifier que PostgreSQL est démarré
# Windows
services.msc

# Linux
sudo systemctl status postgresql

# Vérifier la connexion
psql -U syncuser -d syncapp -h localhost

# Si échec, vérifier application.properties
```

### Problème : Frontend affiche "Network Error"

**Erreur** : `ERR_CONNECTION_REFUSED`

**Solution** :
```bash
# Vérifier que le backend tourne sur port 8080
curl http://localhost:8080/actuator/health

# Vérifier CORS dans WebConfig.java
# Redémarrer le backend
```

### Problème : Erreur CORS

**Erreur** : `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution** :
Vérifier dans `WebConfig.java` :
```java
.allowedOrigins(
    "http://localhost:3000",
    "http://127.0.0.1:3000"
)
```

### Problème : JWT invalide

**Erreur** : `401 Unauthorized`

**Solution** :
```javascript
// Supprimer le token et se reconnecter
localStorage.removeItem('token');
localStorage.removeItem('user');
// Puis se reconnecter
```

### Problème : Maven wrapper échoue

**Erreur** : `mvnw.cmd failed`

**Solution** :
```bash
# Utiliser Maven directement
mvn clean install -DskipTests
mvn spring-boot:run

# Ou réinitialiser le wrapper
mvn -N wrapper:wrapper
```

### Problème : Dépendances npm manquantes

**Erreur** : `Module not found`

**Solution** :
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Si ça ne fonctionne pas
npm install --legacy-peer-deps
```

---

## 📝 Notes importantes

### Sécurité

⚠️ **Avant déploiement en production** :

1. **Changer le secret JWT** dans `application.properties`
2. **Utiliser des mots de passe forts** pour la base de données
3. **Activer HTTPS**
4. **Configurer les CORS** pour autoriser uniquement les domaines de production
5. **Désactiver** `spring.jpa.show-sql` en production
6. **Utiliser des variables d'environnement** pour les secrets

### Mode production

```properties
# application-prod.properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
server.port=8080
```

```bash
# Lancer en mode production
java -jar -Dspring.profiles.active=prod target/hkeyitna-0.0.1-SNAPSHOT.jar
```

---

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👥 Auteurs

**Équipe HKEYITNA**
- Backend : Spring Boot + PostgreSQL
- Frontend : React + Argon Dashboard
- Version : 1.0.0

---

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation technique dans `/docs`

---

## 🎉 Merci d'utiliser HKEYITNA !

Bonne synchronisation ! 📅✨
