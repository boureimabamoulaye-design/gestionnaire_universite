<?php
/**
 * Configuration Générale de l'Application
 * Gestion Scolaire Universitaire
 */

// Nom de l'application
define('APP_NAME', 'Gestion Scolaire Universitaire');
define('APP_VERSION', '1.0.0');
define('APP_COUNTRY', 'République du Mali');

// URL de base (Ajuster selon l'installation WAMP/XAMPP)
define('BASE_URL', 'http://localhost/gestion_scolaire/');

// Chemins du système
define('ROOT_PATH', dirname(__DIR__) . '/');
define('UPLOAD_PATH', ROOT_PATH . 'uploads/');

// Paramètres de session & sécurité
define('SESSION_LIFETIME', 3600); // 1 heure d'inactivité
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes de blocage

// Fuseau horaire du Mali
date_default_timezone_set('Africa/Bamako');

// Configuration des erreurs (Passer à 0 en production)
error_reporting(E_ALL);
ini_set('display_errors', '1');
