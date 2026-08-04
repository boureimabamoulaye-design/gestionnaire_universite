# Application de Gestion Scolaire Universitaire (Universités du Mali)

Système web professionnel, sécurisé et performant de **Gestion Scolaire Universitaire** conçu spécifiquement pour les Universités de la République du Mali (USTTB, ULSHB, USJPB, etc.).

## 🚀 Fonctionnalités Clés

* **Sécurité Renforcée** : Authentification PDO MySQL, hachage `password_hash()`, protection contre les attaques CSRF, prévention contre les injections SQL via requêtes préparées, gestion sécurisée des sessions avec timeout d'inactivité.
* **Espace Administrateur** : Tableau de bord complet, gestion de la structure académique (Universités, Facultés, Filières, Niveaux, Classes, Matières, Années Académiques), Inscriptions, Notes collectives/individuelles, Bulletins automatiques, Comptabilité & Paiements, Rapports PDF/Excel, Paramètres système.
* **Espace Étudiant (Lecture Seule)** : Connexion par Matricule, consultation du Profil, des Notes, des Bulletins et du Reçu/Historique des paiements.
* **Calculs Automatiques** : Moyennes pondérées selon la formule malienne `(CC * 0.4) + (Exam * 0.6)`, validation des crédits LMD, mentions, rangs et décisions d'admission.
* **Design Professionnel & Épuré** : Interface blanche moderne, bordures arrondies (12px), boutons bleus discrets, aucun effet exagéré, 100% responsive avec menu mobile rétractable.

---

## 🛠️ Installation sur WAMP / XAMPP

### 1. Prérequis
* WAMP Server ou XAMPP avec **PHP 8.0+** et **MySQL 5.7+ / MariaDB**
* Navigateur Web moderne (Chrome, Edge, Firefox, Safari)

### 2. Déploiement des Fichiers
Copiez le dossier du projet dans le répertoire racine de votre serveur web :
* Pour **WAMP** : `C:\wamp64\www\gestion_scolaire\`
* Pour **XAMPP** : `C:\xampp\htdocs\gestion_scolaire\`

### 3. Importation de la Base de Données `universite`
1. Ouvrez **phpMyAdmin** (`http://localhost/phpmyadmin/`)
2. Créez une nouvelle base de données nommée **`universite`** avec le jeu de caractères `utf8mb4_unicode_ci`.
3. Cliquez sur l'onglet **Importer**.
4. Sélectionnez le fichier **`universite.sql`** situé à la racine du projet, puis validez.

### 4. Configuration de la Connexion (`config/database.php`)
Si votre serveur MySQL utilise un mot de passe pour l'utilisateur `root`, modifiez le fichier `config/database.php` :
```php
private string $host = "localhost";
private string $db_name = "universite";
private string $username = "root";
private string $password = "VOTRE_MOT_DE_PASSE";
```

---

## 🔑 Identifiants de Connexion par Défaut

### 1. Espace Administrateur
* **URL** : `http://localhost/gestion_scolaire/login.php`
* **Onglet** : Administrateur
* **Email** : `admin@universite.ml`
* **Mot de passe** : `admin123`

### 2. Espace Étudiant
* **URL** : `http://localhost/gestion_scolaire/login.php`
* **Onglet** : Étudiant
* **Matricule** : `2025-001`
* **Mot de passe** : `etudiant123`

---

## 📂 Structure du Projet

```
gestion_scolaire/
├── assets/
│   ├── css/style.css
│   └── js/main.js
├── config/
│   ├── config.php
│   ├── database.php
│   └── init.php
├── includes/
│   ├── auth.php
│   ├── footer.php
│   ├── functions.php
│   ├── header.php
│   └── sidebar.php
├── admin/
│   ├── dashboard.php
│   ├── universites/
│   ├── facultes/
│   ├── filieres/
│   ├── niveaux/
│   ├── classes/
│   ├── etudiants/
│   ├── enseignants/
│   ├── matieres/
│   ├── notes/
│   ├── bulletins/
│   ├── inscriptions/
│   ├── paiements/
│   ├── utilisateurs/
│   ├── rapports/
│   └── parametres/
├── etudiant/
│   ├── dashboard.php
│   ├── profil.php
│   ├── notes.php
│   ├── bulletins.php
│   └── paiements.php
├── uploads/
├── login.php
├── logout.php
├── index.php
├── universite.sql
└── README.md
```

---
Conçu avec soin pour le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique du Mali.
