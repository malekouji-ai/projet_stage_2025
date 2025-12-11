Documentation Théorique – Spring Boot + React + PostgreSQL

1) Architecture générale

- Frontend: ReactJS (SPA) pour l'interface web des utilisateurs; affiche les emplois du temps et l'état de synchronisation.
- Backend: Spring Boot (API REST, logique métier, communication PostgreSQL, communication Microsoft Graph API Outlook).
- Base de données: PostgreSQL pour stocker les évènements internes et les logs d'audit.

2) Rôle technique de chaque technologie

| techno      | rôle                                                                            |
|-------------|----------------------------------------------------------------------------------|
| Spring Boot | création de l’API, sécurité OAuth2, services métier, jobs de synchronisation     |
| ReactJS     | vues web, appels à l’API, affichage d’états et de logs                           |
| PostgreSQL  | stockage structuré des évènements (cours, examens, absences), audit              |

3) Concept de synchronisation bi-directionnelle

| direction | sens              | description                                                                 |
|-----------|-------------------|-----------------------------------------------------------------------------|
| Descente  | EDT → Outlook     | création interne → publication dans le calendrier Outlook de l’utilisateur |
| Montée    | Outlook → EDT     | création Outlook (réunion/absence) → import et ajout dans l’EDT            |

Les deux flux sont traités en parallèle via des jobs planifiés et un mécanisme d’audit + reprise.

4) Microsoft Graph API

Graph est l’API officielle pour Microsoft 365. Partie utilisée: Calendar.

- lister, créer, modifier, supprimer des évènements
- webhooks (optionnel) pour recevoir des notifications

5) Gestion des conflits

Si un évènement EDT chevauche un évènement Outlook:

- détection d’overlap par fenêtres [start,end)
- stratégie configurable: auto-résolution (déplacer/rejeter) ou émission d’alerte utilisateur

6) Pourquoi PostgreSQL?

Robuste, open source, très bon support Spring Data JPA. Idéal pour les évènements structurés.

7) Pourquoi Spring Boot?

Standard pro pour API REST, intégration Security/OAuth2, support MS Graph via librairies Java.

8) Pourquoi React?

SPA moderne, dynamique, idéal pour monitoring en temps réel.

9) Flux d’authentification (OAuth2 Client Credentials par défaut)

- Le backend obtient un token auprès d'Azure AD (app registration) via client_credentials
- Scopes: `https://graph.microsoft.com/.default`
- Le frontend n’accède jamais directement à Graph; il parle uniquement au backend.

10) Endpoints clefs de l’API backend

- `GET /api/health` – état de l’application
- `GET /api/sync/status` – derniers statuts des jobs
- `POST /api/sync/push` – forcer une synchro EDT → Outlook
- `POST /api/sync/pull` – forcer une synchro Outlook → EDT
- `GET /api/logs` – logs d’audit paginés

11) Modèle de données (simplifié)

- `event` (id, source, externalId, title, description, start, end, location, updatedAt)
- `audit_log` (id, level, message, context, createdAt)

12) Déploiement

- Postgres via Docker
- Backend: Spring Boot jar
- Frontend: bundle static (Vite) servi par Nginx ou le serveur du backend (optionnel)


