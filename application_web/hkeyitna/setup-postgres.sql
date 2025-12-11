-- Script de configuration PostgreSQL pour l'application hkeyitna
-- À exécuter dans pgAdmin ou psql en tant que superutilisateur (postgres)

-- 1. Créer la base de données
DROP DATABASE IF EXISTS syncapp;

CREATE DATABASE syncapp;

-- 2. Créer l'utilisateur
DROP USER IF EXISTS syncuser;

CREATE USER syncuser WITH PASSWORD 'syncpass';

-- 3. Donner tous les privilèges à syncuser sur la base syncapp
GRANT ALL PRIVILEGES ON DATABASE syncapp TO syncuser;

-- 4. Se connecter à la base syncapp et donner les permissions sur le schéma
\c syncapp GRANT ALL ON SCHEMA public TO syncuser;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO syncuser;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO syncuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO syncuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO syncuser;

-- Fin du script
-- Vous pouvez maintenant démarrer l'application Spring Boot