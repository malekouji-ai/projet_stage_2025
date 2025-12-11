-- Script de configuration de la base de données PostgreSQL
-- Exécutez ce script avec un utilisateur PostgreSQL administrateur (postgres)

-- 1. Créer la base de données
CREATE DATABASE syncapp;

-- 2. Créer l'utilisateur
CREATE USER syncuser WITH PASSWORD 'syncpass';

-- 3. Donner tous les privilèges à l'utilisateur sur la base de données
GRANT ALL PRIVILEGES ON DATABASE syncapp TO syncuser;

-- 4. Se connecter à la base de données syncapp et donner les privilèges sur le schéma
\c syncapp

-- 5. Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO syncuser;

-- 6. Donner les privilèges pour créer des tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO syncuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO syncuser;

-- Afficher un message de confirmation
SELECT 'Base de données syncapp créée avec succès!' AS status;

SELECT 'Utilisateur syncuser créé avec succès!' AS status;